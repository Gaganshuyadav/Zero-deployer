const { incrementCounter } = require("../../custom_funcs/counter");
const { kafkaProducer } = require("./kafka.producer");
import os from "os";
import { strictEnvs } from "../../utils/envChecker";


exports.produceLogs = async ( logString, logLevel) =>{
    console.log(logString);
    await kafkaProducer( 
        { 
            topic: "build-container-logs", 
            partition: 0, 
            key: String(incrementCounter()), 
            message: 
            { 
                user_id: strictEnvs.SERVER_USER_ID,
                project_id: strictEnvs.SERVER_PROJECT_ID,
                deployment_id: strictEnvs.SERVER_DEPLOYMENT_ID, 
                log_level: logLevel,
                message: logString,
                source: "BUILD",
                container_id: "123456_unknown_container_id",
                host: os.hostname() ? os.hostname() : ""
            }
        }
    );
}

