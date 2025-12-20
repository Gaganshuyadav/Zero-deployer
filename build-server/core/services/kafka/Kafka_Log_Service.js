const { incrementCounter } = require("../../custom_funcs/counter");
const { kafkaProducer } = require("./kafka.producer")


const produceLogs = async ( logString) =>{
    console.log(logString);
    await kafkaProducer( { topic: "build-container-logs", partition: 1, key: incrementCounter(), message: logString});
}


export { produceLogs};