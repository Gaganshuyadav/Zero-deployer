import { kafkaClient } from "./client.kafka.js"; 


async function kafkaProducer( { topic, partition, key, message }){

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

export { kafkaProducer};