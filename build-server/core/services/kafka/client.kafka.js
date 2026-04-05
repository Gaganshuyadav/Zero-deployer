const { Kafka} = require("kafkajs");

//create kafka client
const kafkaClient = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: JSON.parse(process.env.KAFKA_BROKERS_LIST || "[]")
})

module.exports = { kafkaClient};