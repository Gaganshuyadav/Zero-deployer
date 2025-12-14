

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


async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: [TOPIC], fromBeginning: false });

  console.log("Consumer connected and subscribed to", TOPIC);

  await consumer.run({
    autoCommit: false, 
    
    eachBatchAutoResolve: false, // we'll call resolveOffset ourselves
    eachBatch: async (payload) => {
     
      if (shuttingDown) {
        console.info("Shutting down: skipping batch processing");
        return;
      }
      // await processBatch(payload);
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
