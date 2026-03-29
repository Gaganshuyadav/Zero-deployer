import { initConfig, optionalEnv, strictEnvs } from './config/envConfig.js';
initConfig();
import express from  'express';
import cors from "cors";
import { generateRandomId } from './utils/generate-functions.js';
import { sqsService } from './aws/sqsService.js';
import { consumerClient, kafkaConsumer } from './consumers/Kafka.consumer.js';
import { shutdownSignals } from './constants/shutdownSignals.js';
import { shutdownState } from './states/shutdownState.js';
import router from './routes/index.js';
import { errorMiddleware } from './middleware/error.js';
import { clickHouseService } from './services/clickhouseService.js';
import { clickhouseDB } from './DB/clickHouse.db.js';


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
  optionalEnv.IS_KAFKA_EXIST!=='1' ? console.log("kafka Consumer run in local") : kafkaConsumer({ topics: ["build-container-logs"]});
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


  app.put("/random", async( req, res)=>{

    const resD = await clickhouseDB.createTableForAllLogs();

    res.json({
      error: false,
      data: resD
    })
  
  
  })

  app.get("/findit", async( req, res)=>{

    const resD = await clickhouseDB.findAllLogsQuery({
      userId: "550e8400-e29b-41d4-a716-446655460001",
      // projectId: "550e8400-e29b-41d4-a716-446655460002",
      // deploymentId: "550e8400-e29b-41d4-a716-446655460003",
      // page: 1,
      // limit: 2
    });


    res.json({
      error: false,
      data: resD
    })
  
  
  })

  app.post("/add-data", async ( req, res)=>{

    const resD = await clickhouseDB.insertMultipleRows(
      [{
        user_id: "550e8400-e29b-41d4-a716-446655460001",
        project_id: "550e8400-e29b-41d4-a716-446655460002",
        deployment_id: "550e8400-e29b-41d4-a716-446655460003",
        log_level: "INFO",
        message: "Service started successfully",
        source: "BUILD",
        container_id: "container_123",
        host: "ip-192-168-1-10",
        // event_time: "2026-03-28T10:15:30.123",
        event_time: (new Date().toISOString()).replace("Z",""),
        event_id: "550e8400-e29b-41d4-a716-446655440004"
        // kafka_partition: 2,
        // kafka_offset: "10567"
      }]
    )

    return res.json({
      error: false,
      data: resD
    })

  })


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