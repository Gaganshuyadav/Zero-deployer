import { kafkaClient } from "../config/client.kafka.js";


async function kafkaConsumer( { topics}:{ topics:string[]}){

    // const consumer = KafkaClient.consumer({ groupId: "user-1", fetchMinBytes: 1024, fetchMaxWaitMs: 2000});
    const consumer = kafkaClient.consumer({ groupId: "user-1"});

    console.log("Connecting Kafka Consumer");
    await consumer.connect();
    console.log("Consumer Connected Successfully");

    await consumer.subscribe({ topics: [...topics] });

    await consumer.run({

        eachBatch: async ({
            batch,
            resolveOffset,
            heartbeat,
            commitOffsetsIfNecessary
        }) => {

            console.log("--------------------");
            console.log("topic:", batch.topic, "partition:", batch.partition);
        
            for (const message of batch.messages) {
              console.log("message:", message?.value?.toString());
        
              resolveOffset(message.offset); // mark as processed
              await heartbeat();             // avoid consumer timeout
            }
        
            await commitOffsetsIfNecessary();
            console.log("--------------------");
        }
    })
}

export { kafkaConsumer};
