import { Kafka} from "kafkajs";
import { strictEnvs } from "./envConfig.js";

//create kafka client
const kafkaClient = new Kafka({
    clientId: strictEnvs.KAFKA_CLIENT_ID as string,
    brokers: JSON.parse(strictEnvs.KAFKA_BROKERS_LIST || "[]")  as Array<string>
})

export { kafkaClient};