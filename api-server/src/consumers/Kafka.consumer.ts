import type { EachBatchHandler, EachMessageHandler, ConsumerRunConfig } from "kafkajs";
import { kafkaClient } from "../config/client.kafka.js";
import { processBatch } from "../services/kafkaService.js";
import { shutdownState } from "../states/shutdownState.js";


type ConsumerConfig = {
    fetchMinBytes?: number,
    fetchMaxBytes?: number,
    fetchMaxWaits?: number
}

type ConsumerCustomRunConfig = ConsumerRunConfig & ConsumerConfig;



const consumerClient = kafkaClient.consumer(
    { 
        groupId: "user-3"
    }
);


async function kafkaConsumer( { topics}:{ topics:string[]}){

    // const consumer = kafkaClient.consumer({ groupId: "user-1", fetchMinBytes: 1024, fetchMaxWaitMs: 2000});
    // const consumer = kafkaClient.consumer(
    //     { 
    //         groupId: "user-3"
    //     }
    // );

    console.log("Connecting Kafka Consumer");
    await consumerClient.connect();
    console.log("Consumer Connected Successfully");

    await consumerClient.subscribe({ topics: [...topics] });

    await consumerClient.run({

        fetchMinBytes: 1 * 1024 * 1024,   
        fetchMaxBytes: 50 * 1024 * 1024,
        fetchMaxWaitMs: 200,      
        autoCommit: false,
        eachBatchAutoResolve: false,

        eachBatch: async ( kafkaPayload) => {

            // If shutting down, skip processing to let graceful shutdown happen
            if( shutdownState.getShutdownState){
                console.info("Shutting down: skipping batch processing");
                return;
            }

            // process Batch in chunks
            await processBatch( kafkaPayload, consumerClient);

            /*
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

            */
        }


    } as ConsumerCustomRunConfig);
}

export { kafkaConsumer, consumerClient};
