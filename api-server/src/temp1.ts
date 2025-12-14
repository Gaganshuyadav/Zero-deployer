/**
 * Ultra-high-throughput Kafka -> ClickHouse consumer
 *
 * Key ideas:
 * - eachBatch (KafkaJS) gives you a batch for a single partition (topic+partition)
 * - process in chunks (CHUNK_SIZE) to avoid too-large inserts
 * - commit offsets only once per partition (highest offset processed + 1)
 * - pause partition on repeated failures to apply backpressure
 */

import { Kafka, logLevel } from "kafkajs";
import { createClient } from "@clickhouse/client";
import pRetry from "p-retry";
import { v4 as uuidv4 } from "uuid";

const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"];
const TOPIC = process.env.KAFKA_TOPIC || "container-logs";
const GROUP_ID = process.env.KAFKA_GROUP || "ch-writer-group";

const CHUNK_SIZE = Number(process.env.CHUNK_SIZE) || 1000; // rows per ClickHouse insert
const CHUNK_TIMEOUT_MS = Number(process.env.CHUNK_TIMEOUT_MS) || 1000; // not used here but useful for buffering
const MAX_RETRIES = Number(process.env.MAX_RETRIES) || 5;
const PAUSE_ON_FAIL_THRESHOLD = Number(process.env.PAUSE_ON_FAIL_THRESHOLD) || 3; // consecutive fails before pause
const PAUSE_DURATION_MS = Number(process.env.PAUSE_DURATION_MS) || 30_000; // how long to pause partition when failing

// ClickHouse client
const ch = createClient({
  url: process.env.CLICKHOUSE_URL || "http://localhost:8123",
  basicAuth: {
    username: process.env.CLICKHOUSE_USER || "default",
    password: process.env.CLICKHOUSE_PASSWORD || "",
  },
  // adjust timeouts/concurrency here if needed
});

// Kafka client & consumer
const kafka = new Kafka({
  clientId: "ch-high-throughput-consumer",
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.INFO,
});

const consumer = kafka.consumer({ groupId: GROUP_ID, allowAutoTopicCreation: false });
let shuttingDown = false;

// track consecutive failures per topic-partition
const failureCounts = new Map();

function tpKey(topic, partition) {
  return `${topic}-${partition}`;
}

/**
 * Bulk insert to ClickHouse: expects an array of plain objects that match table schema
 * Uses JSONEachRow format which is fast & safe for schemas like:
 *   (event_id String, deployment_id String, log String, created_at DateTime64)
 */
async function insertToClickhouse(rows) {
  if (!rows || rows.length === 0) return;

  // Use pRetry to do exponential backoff on transient errors
  await pRetry(
    async () => {
      // The client.insert supports piping a string; we send JSONEachRow.
      // Build newline-separated JSON rows. For extreme performance, consider streaming.
      const body = rows.map(r => JSON.stringify(r)).join("\n");

      // Example: insert into default.log_events (adjust DB.table name)
      const insertQuery = `INSERT INTO default.log_events FORMAT JSONEachRow`;
      const resp = await ch.insert({
        query: insertQuery,
        // data must be string | Buffer | stream
        data: body,
      });

      // If ClickHouse returns an error, createClient will throw.
      return resp;
    },
    {
      retries: MAX_RETRIES,
      factor: 2,
      minTimeout: 1000,
      onFailedAttempt: err => {
        console.warn(`ClickHouse insert attempt ${err.attemptNumber} failed. ${err.retriesLeft} retries left.`, err);
      }
    }
  );
}

/**
 * Process a single KafkaJS batch (one topic+partition)
 * We chunk the batch.messages into smaller arrays and insert each chunk to CH,
 * then only commit the highest processed offset for this partition.
 */
async function processBatch({ batch, resolveOffset, heartbeat, commitOffsetsIfNecessary, uncommittedOffsets, isRunning, isStale, pause }) {
  const { topic, partition, messages } = batch;
  if (!messages || messages.length === 0) return;

  console.log(`Batch received: topic=${topic} partition=${partition} messages=${messages.length}`);

  // prepare rows to insert for ClickHouse
  // map kafka message -> row object: tune fields to match your CH schema
  const rows = messages.map(m => {
    let parsed = null;
    try {
      const s = m.value.toString();
      parsed = JSON.parse(s);
    } catch (err) {
      // if message invalid JSON, mark for DLQ or skip
      parsed = null;
    }
    return {
      event_id: parsed?.EVENT_ID || uuidv4(),
      deployment_id: parsed?.DEPLOYEMENT_ID || parsed?.DEPLOYMENT_ID || null,
      project_id: parsed?.PROJECT_ID || null,
      log: parsed?.log ?? (m.value ? m.value.toString() : null),
      kafka_partition: partition,
      kafka_offset: Number(m.offset),
      created_at: parsed?.ts ? new Date(parsed.ts).toISOString() : new Date().toISOString()
    };
  });

  // chunk rows to avoid giant inserts
  const chunks = [];
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    chunks.push(rows.slice(i, i + CHUNK_SIZE));
  }

  // highest offset processed in this batch
  let highestOffset = -1;

  try {
    for (const chunk of chunks) {
      // before heavy op, keep the group alive
      await heartbeat();

      // Insert chunk to ClickHouse (with retries)
      await insertToClickhouse(chunk);

      // after successful insert, mark offsets in that chunk as resolved
      for (const r of chunk) {
        // resolveOffset expects the raw Kafka offset string; we find the corresponding message
        // Find the message with matching kafka_offset
        // (Note: messages array is not huge; if it is, optimize with a map)
        const matching = messages.find(m => Number(m.offset) === r.kafka_offset);
        if (matching) {
          resolveOffset(matching.offset);
        }
      }

      // update highest offset to commit later
      const maxInChunk = Math.max(...chunk.map(r => r.kafka_offset));
      if (maxInChunk > highestOffset) highestOffset = maxInChunk;
    }

    // commit **only once** per partition: commit highestOffset + 1
    if (highestOffset >= 0) {
      const commitOffset = (highestOffset + 1).toString();
      await consumer.commitOffsets([{ topic, partition, offset: commitOffset }]);
      console.log(`Committed offset for ${topic}[${partition}] -> ${commitOffset}`);
    }

    // clear any failure count for this tp
    failureCounts.delete(tpKey(topic, partition));

  } catch (err) {
    console.error(`Failed processing batch topic=${topic} partition=${partition}:`, err);

    // increment failure count for partition
    const key = tpKey(topic, partition);
    const prev = failureCounts.get(key) || 0;
    const nowCount = prev + 1;
    failureCounts.set(key, nowCount);

    // If repeated failures, pause the partition to apply backpressure
    if (nowCount >= PAUSE_ON_FAIL_THRESHOLD) {
      console.warn(`Pausing partition ${topic}[${partition}] for ${PAUSE_DURATION_MS}ms due to ${nowCount} consecutive failures`);
      consumer.pause([{ topic, partitions: [partition] }]);
      setTimeout(() => {
        console.info(`Resuming partition ${topic}[${partition}] after pause.`);
        consumer.resume([{ topic, partitions: [partition] }]);
        // optionally reset failure count
        failureCounts.delete(key);
      }, PAUSE_DURATION_MS);
    }

    // Optionally send messages to a DLQ topic if they are poison (not implemented here)
    // Do NOT commit offsets here, so messages will be retried.
  }
}

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: [TOPIC], fromBeginning: false });

  console.log("Consumer connected and subscribed to", TOPIC);

  await consumer.run({
    autoCommit: false, // we commit manually after DB success
    // eachBatch gets an entire batch for one partition
    eachBatchAutoResolve: false, // we'll call resolveOffset ourselves
    eachBatch: async (payload) => {
      // If shutting down, skip processing to let graceful shutdown happen
      if (shuttingDown) {
        console.info("Shutting down: skipping batch processing");
        return;
      }
      await processBatch(payload);
    },
  });
}

// graceful shutdown
async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info("Shutdown requested: disconnecting consumer...");
  try {
    await consumer.disconnect();
    console.info("Consumer disconnected");
  } catch (err) {
    console.error("Error during consumer disconnect:", err);
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

runConsumer().catch(err => {
  console.error("Fatal consumer error:", err);
  process.exit(1);
});
