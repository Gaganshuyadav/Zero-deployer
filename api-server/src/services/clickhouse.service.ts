import pRetry from "p-retry"
import type { ClickHouseLogEvent, findAllLogsQuerySchema, KafkaMessageRawLogEvent } from "../types/interfaces/clickhouse_log_event_schema.js"
import { strictEnvs } from "../config/envConfig.js";
import { clickhouseDB } from "../DB/clickHouse.db.js";


class ClickHouseService{

    public async insertChunkIntoClickhouse( chunkRows:Array<KafkaMessageRawLogEvent | ClickHouseLogEvent>){

        if( !chunkRows || chunkRows.length===0) return;

        console.log("Chunk::::--- ",chunkRows);


        // Use pRetry to do exponential backoff on transient errors
        await pRetry(
            ()=>{
    
                // The client.insert supports piping a string, we send JSONEachRow.
                // for extreme performance, consider streaming.

                // convert event_time based on clickhose
                chunkRows = chunkRows.map( chunk=>{
                    return { ...chunk, ...{ event_time: (new Date(chunk.event_time as string).toISOString()).replace("Z","") } }
                })

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

    public getAllLogs = async ( query:findAllLogsQuerySchema)=>{


        let limit = query.limit ?? 200;
        let page = query.page ?? 1;
        let skip = (page-1)*limit;

        const allowedOrderBy = [ "event_time"];
        let orderBy = allowedOrderBy.includes( query?.orderBy || "") ? query.orderBy : "";
        if( !orderBy){ orderBy = "event_time"; }

        const conditions = [`user_id={userId:UUID}`]

        if( query.projectId){
            conditions.push(`project_id={projectId:UUID}`);
        }

        if( query.deploymentId){
            conditions.push(`deployment_id={deploymentId:UUID}`);
        }

        const where = `WHERE ${conditions.join(" AND ")}`;


        const data = await clickhouseDB.findAllLogsQuery({
            userId: query.userId,
            projectId: query.projectId,
            deploymentId: query.deploymentId,
            where,
            orderBy,
            limit,
            skip
        });

        return data;

    }

    public createNewTable = async ()=>{
        
        const resData = await clickhouseDB.createTableForAllLogs();

        return resData;
    }


}

const clickHouseService = new ClickHouseService();

export { clickHouseService};