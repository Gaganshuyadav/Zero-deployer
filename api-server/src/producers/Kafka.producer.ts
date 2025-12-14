import { kafkaClient } from "../config/client.kafka.js"; 


async function kafkaProducer( message:any){

    const producer = kafkaClient.producer();

    await producer.connect();

    await producer.send({
        topic: "avengers-current-location-updates",
        messages: message
    })

}

export { kafkaProducer};