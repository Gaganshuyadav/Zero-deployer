import { Redis} from "ioredis";

const redisConfig = {
  redisEnabled: process.env.IS_REDIS_ENABLED === "1",
  redisHost: process.env.REDIS_HOST || "127.0.0.1",
  redisPort: Number(process.env.REDIS_PORT) || 6379,
};

let redisClient;
if( redisConfig.redisEnabled){
    const redisClient = new Redis({
        port: redisConfig.redisPort,
        host: redisConfig.redisHost
    });
}
else{
    console.log("Redis is disabled");
}


export { redisClient, redisConfig};
