
import { createClient} from "@clickhouse/client";
import { strictEnvs } from "./envConfig.js";

const clickhouseClient = createClient({
    url: strictEnvs.CLICKHOUSE_URL || "http://localhost:8123",
    username: strictEnvs.CLICKHOUSE_USERNAME || "default",
    password: strictEnvs.CLICKHOUSE_PASSWORD || ""
})

export { clickhouseClient};























































































































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
//     event_id: crypto.randomUUID(),     
//     user_id: process.env.USER_ID,
//     project_id: process.env.PROJECT_ID,
//     deployment_id: process.env.REPO_ID,

//     log_level: level,
//     message,

//     source: 'build',
//     container_id: process.env.HOSTNAME,  
//     host: os.hostname(),

//     event_time: new Date().toISOString()
//   };

