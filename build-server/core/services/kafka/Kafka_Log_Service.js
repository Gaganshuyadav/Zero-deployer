const { incrementCounter } = require("../../custom_funcs/counter");
const { kafkaProducer } = require("./kafka.producer")


exports.produceLogs = async ( logString, logLevel) =>{
    console.log(logString);
    await kafkaProducer( { topic: "build-container-logs", partition: 0, key: String(incrementCounter()), message: { logString, logLevel}});
}

