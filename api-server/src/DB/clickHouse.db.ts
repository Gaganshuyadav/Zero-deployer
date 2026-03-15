import { clickhouseClient } from "../config/clickhouse.js";
import type { KafkaMessageRawLogEvent } from "../types/interfaces/clickhouse_log_event_schema.js";

class ClickhouseDB{

    public async createTableForAllLogs(){
        
        // execute commands with no result

        try{
            const res = await clickhouseClient.command({
                query: `
                    CREATE TABLE IF NOT EXISTs log_events
                    (
                        user_id        UUID,
                        project_id     UUID,
                        deployment_id  UUID,
                    
                        log_level Enum8(
                            'DEBUG'  = 1,
                            'INFO'  = 2,
                            'WARN' = 3,
                            'ERROR' = 4,
                            'FATAL' = 5
                        ) DEFAULT 'INFO',
                    
                        message        String,
                    
                        source Enum8(
                            'CONTAINER' = 1,
                            'BUILD'     = 2,
                            'RUNTIME'   = 3,
                            'SYSTEM'    = 4
                        ) DEFAULT 'CONTAINER',
                    
                        container_id   Nullable(String),
                        host           Nullable(String),
                    
                        event_time     DateTime64(3, 'UTC') DEFAULT now64(3),
                        event_id       UUID
                    )
                    ENGINE = MergeTree
                    PARTITION BY toYYYYMM(event_time)
                    ORDER BY (project_id, deployment_id, event_time)
                    SETTINGS index_granularity = 8192;
                `
            })

            console.log(res);

            console.log("Logs table Created Successfully");
    
        }
        catch(err){
            console.log("Table Creation Failed ",err);
        }
    }

    public async findAllQuery(){

        try{
            const res = await clickhouseClient.query({
                query: "SELECT * FROM log_events",
                format: `JSONEachRow`
            })

            console.log(res);

            console.log("Find Query Run Successfully");

            return res;

        }
        catch(err){
            console.log("Find Query Failed",err);
        }
    }

    public async insertMultipleRows( rows:Array<KafkaMessageRawLogEvent>){

        try{

            const res = await clickhouseClient.insert({
                table: "log_events",
                values: [ ...rows],
                format: "JSONEachRow"
            })

            console.log(res);

            console.log("Log Inserted Successfully");
        }
        catch(err){
            console.log("Insert Log Failed", err);
        }
    }


}

const clickhouseDB = new ClickhouseDB();

export { clickhouseDB};












//clickhose


// CREATE TABLE log_events
// (
//     user_id        UUID,
//     project_id     UUID,
//     deployment_id  UUID,

//     log_level Enum8(
//         'INFO'  = 1,
//         'WARN'  = 2,
//         'ERROR' = 3,
//         'DEBUG' = 4
//     ) DEFAULT 'INFO',

//     message        String,

//     source Enum8(
//         'container' = 1,
//         'build'     = 2,
//         'runtime'   = 3,
//         'system'    = 4
//     ) DEFAULT 'container',

//     container_id   Nullable(String),
//     host           Nullable(String),

//     event_time     DateTime64(3, 'UTC') DEFAULT now64(3),
//     event_id       UUID
// )
// ENGINE = MergeTree
// PARTITION BY toYYYYMM(event_time)
// ORDER BY (project_id, deployment_id, event_time)
// SETTINGS index_granularity = 8192;




// const logEvent = {
//     event_id: crypto.randomUUID(),        // uniqueness
//     user_id: process.env.USER_ID,
//     project_id: process.env.PROJECT_ID,
//     deployment_id: process.env.REPO_ID,

//     log_level: level,
//     message,

//     source: 'build',
//     container_id: process.env.HOSTNAME,   // ECS sets this
//     host: os.hostname(),

//     event_time: new Date().toISOString()
//   };

