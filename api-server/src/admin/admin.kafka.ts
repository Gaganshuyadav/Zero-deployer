import { kafkaClient }  from "../config/client.kafka.js";

async function CallKafkaAdmin(){

    //create admin
    const admin = kafkaClient.admin();
    console.log("Creating Admin!!");

    console.log("Admin Connecting... ")
    //connect admin
    await admin.connect();
    console.log("Admin Connection Success...");

    //create topics
    console.log("Admin Creating Topic Now");
    await admin.createTopics({
        topics:[
            {
                topic: "deployment-logging",
                numPartitions: 2
            }
        ]
    })



}

export { CallKafkaAdmin};