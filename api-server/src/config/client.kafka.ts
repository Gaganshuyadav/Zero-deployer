import { Kafka} from "kafkajs";

//create kafka client
const kafkaClient = new Kafka({
    clientId: "my-first-kafka-app",
    brokers: [ "133.165.23.234:9092"]
})

export { kafkaClient};