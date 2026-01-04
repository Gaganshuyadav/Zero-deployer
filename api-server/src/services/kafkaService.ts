import { type Consumer, type EachBatchPayload, type KafkaMessage } from "kafkajs";
import { uuid } from "zod";
import os from "os";
import { strictEnvs } from "../config/envConfig.js";
import { insertChunkIntoClickhouse } from "./clickhouseService.js";
import type { ClickHouseLogEvent, KafkaMessageRawLogEvent } from "../types/interfaces/clickhouse_log_event_schema.js";
import { kafkaTopicPartitionFormatKey } from "../utils/string-format-functions.js";



// track consecutive failures per topic-partition
const failureCountsMap = new Map();


async function processBatch( { batch, resolveOffset, heartbeat, commitOffsetsIfNecessary, uncommittedOffsets, isRunning, isStale, pause}:EachBatchPayload, kafkaConsumer:Consumer ){

    const { topic, partition, messages} = batch;

    if( !messages || messages.length===0) return;

    console.log(`Batch received: topic=${topic} partition=${partition} messages=${messages.length}`);

    // Create rows for Clickhouse Schema --

    const rows:Array<KafkaMessageRawLogEvent> = messages.map( ( message:KafkaMessage)=>{
        let parsed=null;
        try{
            const messageValueData = message?.value?.toString();
            if(!messageValueData){ 
                parsed = null;
            }
            else{
                parsed = JSON.parse( messageValueData);
            }
        }
        catch( err){
            // if message is invalid JSON, mark for DLQ or skip 
            parsed = null;
        }

        return {
            user_id: parsed?.user_id || uuid(),
            project_id: parsed?.project_id || null,
            deployment_id: parsed?.deployment_id || null, 
            log_level: parsed?.log_level || null,
            message: parsed?.message || null,
            source: parsed?.source || null,
            container_id: parsed?.container_id || null,
            host: parsed?.host ? parsed?.host : os.hostname(),
            event_time: parsed?.created_at ? new Date(parsed?.created_at).toISOString() : new Date().toISOString(),
            
            kafka_offset: String(parsed?.offset),
            kafka_partition: batch?.partition
        }
    })
    // .filter(Boolean); // remove null rows




    // chunk rows to avoid giant inserts --
    const BATCH_CHUNK_SIZE = Number(strictEnvs.KAFKA_BATCH_PROCESS_CHUNK_SIZE);

    const chunks:Array<Array<KafkaMessageRawLogEvent>> = [];
    for( let i=0; i < rows.length; i+=BATCH_CHUNK_SIZE ){
        chunks.push( rows.slice( i, i + BATCH_CHUNK_SIZE));
    }

    // highest offset processed in this batch --
    let highestOffset = -1;

    try{

        for( const chunk of chunks){

            // before heavy operation, keep the group alive ---
            await heartbeat();

            // Insert chunk to Clickhouse ( with retries) ---
            await insertChunkIntoClickhouse(chunk);

            // after successful insert, mark offsets in that chunk as resolved ---
            for( const row of chunk){
                resolveOffset(row.kafka_offset);
            }

            // update highest offset to commit later
            const OffsetChunkMap = chunk.map(m=>Number(m.kafka_offset));
            const maxOffsetForChunk = Math.max( ...OffsetChunkMap);
            if( highestOffset < maxOffsetForChunk){ highestOffset=maxOffsetForChunk };

        }


        // commit highestOffset + 1
        if( highestOffset >= 0){
            const commitOffset = ( highestOffset+1).toString();
            await kafkaConsumer.commitOffsets([{ topic, partition, offset: commitOffset }]);
            console.log(`Committed offset for ${topic}[${partition}] -> ${commitOffset}`);
        }

        //clear any failures count for this t-p
        if( failureCountsMap.has( kafkaTopicPartitionFormatKey( topic, partition)) ){
            failureCountsMap.delete( kafkaTopicPartitionFormatKey( topic, partition));
        }

    }
    catch(err){

        console.error(`Failed processing batch topic=${topic} partition=${partition}`, err);

        // increment failures count for partition
        const key = kafkaTopicPartitionFormatKey( topic, partition);
        const prev = failureCountsMap.get(kafkaTopicPartitionFormatKey( topic, partition)) || 0;
        const nowCount = prev+1;
        failureCountsMap.set( kafkaTopicPartitionFormatKey( topic, partition), nowCount);

        // If repeated failures, pause the partition to apply backpressure
        if( nowCount >= Number(strictEnvs.KAFKA_CONSUMER_PAUSE_ON_FAILURE_THRESHOLD) ){
            await kafkaConsumer.pause([{ topic, partitions:[partition]}]);

            setTimeout( async()=>{

                console.info(`Resuming partition ${topic}[${partition}] for ${Number(strictEnvs.KAFKA_CONSUMER_PAUSE_ON_FAILURE_DURATION_MS)}ms due to ${nowCount} consecutive failures`);
                await kafkaConsumer.resume([{ topic, partitions:[partition]}])

                // optionally reset failure count
                failureCountsMap.delete(key);

            }, Number(strictEnvs.KAFKA_CONSUMER_PAUSE_ON_FAILURE_DURATION_MS) );
        }

    }

}



export { processBatch};