import { Redis} from "ioredis";

const redisConfig = {
  redisEnabled: process.env.IS_REDIS_ENABLED === "1",
  redisHost: process.env.REDIS_HOST || "127.0.0.1",
  redisPort: Number(process.env.REDIS_PORT) || 6379,
};

// redis client ( publisher)
let redisClient:Redis | null = null;
if( redisConfig.redisEnabled){

    redisClient = new Redis({
        port: redisConfig.redisPort,
        host: redisConfig.redisHost
    });

    redisClient.on("error", ( err)=>{
        console.error(" Redis Connection Error: ", err);
    })

    redisClient.on("connect", ()=>{
        console.log("Redis Connected");
    })

    redisClient.on("ready", ()=>{
        console.log("Redis ready to use");
    })

    redisClient.on("close", ()=>{
        console.log("Redis Connection closed");
    })

    redisClient.on("reconnecting", ()=>{
        console.log("Redis Connecting...");
    })



}
else{
    console.log("Redis is currently disabled");
}




// subscriber
let redisSub:Redis | null = null;
if( redisConfig.redisEnabled){

    redisSub = new Redis({
        port: redisConfig.redisPort,
        host: redisConfig.redisHost
    });

    redisSub.on("error", ( err)=>{
        console.error(" Redis Sub Connection Error: ", err);
    })

    redisSub.on("connect", ()=>{
        console.log("Redis Sub Connected");
    })

    redisSub.on("ready", ()=>{
        console.log("Redis Sub ready to use");
    })

    redisSub.on("close", ()=>{
        console.log("Redis Sub Connection closed");
    })

    redisSub.on("reconnecting", ()=>{
        console.log("Redis Sub Connecting...");
    })

    // const sub = await redisSub.psubscribe("avenger");

    // redisSub.on("pmessage", ( pattern, channel, message)=>{
    //     console.log("pattern: ",pattern, " channel: ", channel, " message: ", message);
    // })


}
else{
    console.log("Redis Sub is currently disabled");
}


export { redisClient, redisSub, redisConfig};
