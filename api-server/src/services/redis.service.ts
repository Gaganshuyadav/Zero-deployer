import { redisSub } from "../config/redisClient.js";
import type { KafkaMessageRawLogEvent } from "../types/interfaces/clickhouse_log_event_schema.js";
import { sseService } from "./sseService.js";

let isRedisSubscriberStarted = false;

async function startRedisSubscriber() {

    if (isRedisSubscriberStarted) {
        console.log("Redis subscriber already started");
        return;
    }

    const ss = await redisSub?.psubscribe("sse-publish-logs");

    redisSub?.on("pmessage", ( pattern, channel, message)=>{

        const messageData:KafkaMessageRawLogEvent = JSON.parse(message || "");
        console.log(":::::::: ", messageData);

        if(!messageData?.deployment_id) return; 

        sseService. sendLogsToUser( messageData.deployment_id, messageData.message);
        
    })


}

export { startRedisSubscriber};