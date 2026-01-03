import { type EachBatchPayload, type KafkaMessage } from "kafkajs";
import { uuid } from "zod";
import os from "os";

async function processBatch( { batch, resolveOffset, heartbeat, commitOffsetsIfNecessary, uncommittedOffsets, isRunning, isStale, pause}:EachBatchPayload ){

    const { topic, partition, messages} = batch;

    if( !messages || messages.length===0) return;

    console.log(`Batch received: topic=${topic} partition=${partition} messages=${messages.length}`);

    const rows = messages.map( ( message:KafkaMessage)=>{
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

}
