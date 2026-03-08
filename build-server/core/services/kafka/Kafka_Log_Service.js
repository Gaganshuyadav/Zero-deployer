const { incrementCounter } = require("../../custom_funcs/counter");
const { kafkaProducer } = require("./kafka.producer");
const os = require("os");


exports.produceLogs = async ( logString, logLevel) =>{
    console.log(logString);

    if( process.env.IS_KAFKA_EXIST==="1"){

        await kafkaProducer( 
            { 
                topic: "build-container-logs", 
                partition: 0, 
                key: String(incrementCounter()), 
                message: 
                { 
                    user_id: process.env.SERVER_USER_ID,
                    project_id: process.env.SERVER_PROJECT_ID,
                    deployment_id: process.env.SERVER_DEPLOYMENT_ID, 
                    log_level: logLevel,
                    message: logString,
                    source: "BUILD",
                    container_id: `container_id_${Math.floor(Math.random()*10000000)}`,
                    host: os.hostname() ? os.hostname() : ""
                }
            }
        );
    }
    else{
        console.log("Kafka is disabled...");
    }
}

