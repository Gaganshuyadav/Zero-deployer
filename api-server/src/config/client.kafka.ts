import { Kafka} from "kafkajs";

//create kafka client
const kafkaClient = new Kafka({
    clientId: "my-first-kafka-app",
    brokers: [ "0.0.0.0:9092"]
})

export { kafkaClient};