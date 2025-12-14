import { kafkaClient } from "../config/client.kafka.js"; 


async function kafkaProducer( { topic, partition, key, message }:{ topic: string, partition:number, key:string, message:any}){

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