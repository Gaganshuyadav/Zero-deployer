import { initConfig, optionalEnv, strictEnvs } from './config/envConfig.js';
initConfig();
import express from  'express';
import cors from "cors";
import { sqsService } from './aws/sqsService.js';
import { consumerClient, kafkaConsumer } from './consumers/Kafka.consumer.js';
import { shutdownSignals } from './constants/shutdownSignals.js';
import { shutdownState } from './states-manager/shutdownState.js';
import router from './routes/index.js';
import { errorMiddleware } from './middleware/error.js';
import { SSE_Clients } from './states-manager/sse.manager.deployment.js';

const start = async () => {

  const app = express();
  app.use(express.json());
  app.use(cors({
    origin: ["http://localhost:5173", "*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));
  
  //run poll checker function
  optionalEnv.AWS_SQS_SERVICE_EXIST!=='1' ? console.log("poll Checker run in local") : sqsService.ReceiveMessagePollChecker(15000);
  //run kafka consumer
  optionalEnv.IS_KAFKA_EXIST!=='1' ? console.log("kafka Consumer run in local") : kafkaConsumer({ topics: [ strictEnvs.KAFKA_BUILD_TOPIC as string]});
  const port = Number(strictEnvs.PORT) || 3020;
  
// Graceful Shutdown Process
shutdownSignals.forEach(signal => {
  process.on(signal, async () => {
    console.log(`Received ${signal}`);

    if( shutdownState.getShutdownState) return;

    console.info("Shutdown requested: disconnecting consumer...");
    try{
      await consumerClient.disconnect();
      console.info("Consumer Disconnected");
    }
    catch( err){
      console.error("Error during consumer disconnect:", err);
    }
    finally{
      process.exit(0);
    }

  });
});


  // routes
  app.use(router);

  // error handler
  app.use(errorMiddleware);
  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

}

start().catch(err =>{
  console.log('Startup error:',err);
  process.exit(1);
})