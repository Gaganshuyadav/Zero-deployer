import { redisSub } from "../config/redisClient.js";
import { sseService } from "./sseService.js";


async function startRedisSubscriber() {

    const ss = await redisSub?.psubscribe("sse-publish-logs");

    redisSub?.on("pmessage", ( pattern, channel, message)=>{

        const messageData = JSON.parse(message || "");
        console.log(":::::::: ", messageData);

        if(!messageData?.deploymentId) return; 

        // sendLogsToUser( deploymentId:string, logData:any)
        sseService.sendLogsToUser( `${messageData?.deploymentId}`, messageData);
        
    })


}

export { startRedisSubscriber};