import type { EachBatchHandler, EachMessageHandler, ConsumerRunConfig } from "kafkajs";
import { kafkaClient } from "../config/client.kafka.js";


type ConsumerConfig = {
    fetchMinBytes?: number,
    fetchMaxBytes?: number,
    fetchMaxWaits?: number
}

type ConsumerCustomRunConfig = ConsumerRunConfig & ConsumerConfig;


async function kafkaConsumer( { topics}:{ topics:string[]}){

    // const consumer = kafkaClient.consumer({ groupId: "user-1", fetchMinBytes: 1024, fetchMaxWaitMs: 2000});
    const consumer = kafkaClient.consumer(
        { 
            groupId: "user-3"
        }
    );

    console.log("Connecting Kafka Consumer");
    await consumer.connect();
    console.log("Consumer Connected Successfully");

    await consumer.subscribe({ topics: [...topics] });

    await consumer.run({

        // eachMessage: async ( { topic, partition, message})=>{
        //     console.log("--------------------");
        //     console.log(" topic: ",topic," partition: ",partition," message: ",message?.value?.toString());
        //     console.log("--------------------");
        // }

        // /*

        fetchMinBytes: 1 * 1024 * 1024,   
        fetchMaxBytes: 50 * 1024 * 1024,
        fetchMaxWaitMs: 200,      
        autoCommit: false,
        eachBatchAutoResolve: false,
        eachBatch: async ({
            batch,
            resolveOffset,
            heartbeat,
            commitOffsetsIfNecessary
        }) => {

            console.log("--------------------");
            console.log(batch);
            console.log("****************")
            // console.log("topic:", batch.topic, "partition:", batch.partition);
        
            for (const message of batch.messages) {
              console.log("message:", message?.value?.toString());
        
              resolveOffset(message.offset); // mark as processed
              await heartbeat();             // avoid consumer timeout
            }
        
            await commitOffsetsIfNecessary();
            console.log("--------------------");
        }

        // */

    } as ConsumerCustomRunConfig);
}

export { kafkaConsumer};
