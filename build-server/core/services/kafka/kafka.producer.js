const { kafkaClient } = require("./client.kafka.js"); 


exports.kafkaProducer = async ( { topic, partition, key, message })=>{

    const producer = kafkaClient.producer();

    await producer.connect();

    await producer.send({
        topic,
        messages: [
            {
                partition,
                key,
                value: JSON.stringify(message)
            }
        ]
    })

}

