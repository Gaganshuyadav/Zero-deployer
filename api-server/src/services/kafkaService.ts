import { type EachBatchPayload, type KafkaMessage } from "kafkajs";
import { uuid } from "zod";
import os from "os";
import { strictEnvs } from "../config/envConfig.js";
import { insertChunkIntoClickhouse } from "./clickhouseService.js";
import type { ClickHouseLogEvent } from "../types/interfaces/clickhouse_log_event_schema.js";

async function processBatch( { batch, resolveOffset, heartbeat, commitOffsetsIfNecessary, uncommittedOffsets, isRunning, isStale, pause}:EachBatchPayload ){

    const { topic, partition, messages} = batch;

    if( !messages || messages.length===0) return;

    console.log(`Batch received: topic=${topic} partition=${partition} messages=${messages.length}`);

    // Create rows for Clickhouse Schema --

    const rows:Array<ClickHouseLogEvent> = messages.map( ( message:KafkaMessage)=>{
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
            event_time: parsed?.created_at ? new Date(parsed?.created_at).toISOString() : new Date().toISOString()
        }
    })
    .filter(Boolean); // remove null rows




    // chunk rows to avoid giant inserts --
    const BATCH_CHUNK_SIZE = Number(strictEnvs.KAFKA_BATCH_PROCESS_CHUNK_SIZE);

    const chunks = [];
    for( let i=0; i < rows.length; i+=BATCH_CHUNK_SIZE ){
        chunks.push( rows.slice( i, i + BATCH_CHUNK_SIZE));
    }

    // highest offset processed in this batch --
    let highestOffset = -1;

    try{
        for( const chunk of chunks){

            // before heavy operation, keep the group alive
            await heartbeat();

            // Insert chunk to Clickhouse ( with retries)
            insertChunkIntoClickhouse(chunk);
        }
    }



}
