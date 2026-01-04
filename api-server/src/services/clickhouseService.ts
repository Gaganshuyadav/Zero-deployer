import pRetry from "p-retry"
import type { ClickHouseLogEvent, KafkaMessageRawLogEvent } from "../types/interfaces/clickhouse_log_event_schema.js"
import { strictEnvs } from "../config/envConfig.js";


async function insertChunkIntoClickhouse( chunkRows:Array<KafkaMessageRawLogEvent>){

    if( !chunkRows || chunkRows.length===0) return;


    // Use pRetry to do exponential backoff on transient errors
    await pRetry(
        ()=>{

            // The client.insert supports piping a string, we send JSONEachRow.
            // Build newline-separated JSON rows. For extreme performance, consider streaming.
            const body = chunkRows.map(r=>JSON.stringify(r))



            // this insertion query and insert code will be complete later?
            //  ClickHouseLogEvent

        },
        {
            // delay = minTimeout × factor^(retries - 1)
            retries: Number(strictEnvs.PRETRY_CLICKHOUSE_CHUNK_MAX_RETRIES),
            factor: 2,
            minTimeout: 1000,
            onFailedAttempt: ( err) => {
        
                console.warn(`ClickHouse insert attempt ${err.attemptNumber} failed. ${err.retriesLeft} retries left.`, err);
            },

        }
    )



}


export { insertChunkIntoClickhouse};