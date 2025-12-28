const { Kafka} = require("kafkajs");

//create kafka client
const kafkaClient = new Kafka({
    clientId: "my-first-kafka-app",
    brokers: [ "172.28.16.1:9092"]
})

module.exports = { kafkaClient};