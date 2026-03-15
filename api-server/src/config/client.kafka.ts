import { Kafka} from "kafkajs";

//create kafka client
const kafkaClient = new Kafka({
    clientId: "my-first-kafka-app",
    brokers: [ "192.168.1.39:9092"]
})

export { kafkaClient};