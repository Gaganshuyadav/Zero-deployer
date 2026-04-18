import { redisSub } from "../config/redisClient.js";
import type { KafkaMessageRawLogEvent } from "../types/interfaces/clickhouse_log_event_schema.js";
import type { PublisherLogPayload, PublishEventPayload } from "../types/interfaces/redis_types.js";
import { sseService } from "./sseService.js";

let isRedisSubscriberStarted = false;

async function startRedisSubscriber() {

    if (isRedisSubscriberStarted) {
        console.log("Redis subscriber already started");
        return;
    }

    const ss = await redisSub?.psubscribe("sse-publish-logs");

    redisSub?.on("pmessage", ( pattern, channel, message:string)=>{

        const messageData:PublishEventPayload = JSON.parse(message || "");
        console.log(":::::::: ", messageData);

        if ( Array.isArray(messageData) && messageData.multiple) {

          for (const chunk of messageData.payload) {

            sseService.sendLogsToUser(
              chunk.deployment_id,
              chunk
            );
          }
        } else if( messageData.multiple===false && messageData.payload?.deployment_id) {

          sseService.sendLogsToUser(
            messageData.payload?.deployment_id,
            messageData.payload
          );
          
        }


        
    })


}

export { startRedisSubscriber};