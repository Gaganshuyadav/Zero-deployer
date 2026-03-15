import pRetry from "p-retry"
import type { ClickHouseLogEvent, KafkaMessageRawLogEvent } from "../types/interfaces/clickhouse_log_event_schema.js"
import { strictEnvs } from "../config/envConfig.js";
import { clickhouseDB } from "../DB/clickHouse.db.js";


class ClickHouseService{

    public async insertChunkIntoClickhouse( chunkRows:Array<KafkaMessageRawLogEvent>){

        if( !chunkRows || chunkRows.length===0) return;

        console.log("Chunk::::--- ",chunkRows);


        // Use pRetry to do exponential backoff on transient errors
        await pRetry(
            ()=>{
    
                // The client.insert supports piping a string, we send JSONEachRow.
                // for extreme performance, consider streaming.

                clickhouseDB.insertMultipleRows(chunkRows)
            },
            {
                // delay = minTimeout * factor^(retries - 1)
                retries: Number(strictEnvs.PRETRY_CLICKHOUSE_CHUNK_MAX_RETRIES),
                factor: 2,
                minTimeout: 1000,
                onFailedAttempt: ( err) => {
            
                    console.warn(`ClickHouse insert attempt ${err.attemptNumber} failed. ${err.retriesLeft} retries left.`, err);
                },
    
            }
        )



    }


}

const clickHouseService = new ClickHouseService();

export { clickHouseService};