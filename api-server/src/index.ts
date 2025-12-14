import { initConfig, strictEnvs } from './config/envConfig.js';
initConfig();
import express from  'express';
import cors from "cors";
import { generateRandomId } from './utils/generate-functions.js';
import { sqsService } from './aws/sqsService.js';


const start = async () => {
  
  console.log(strictEnvs);

  const app = express();
  app.use(express.json());
  app.use(cors());
  
  //run poll checker function
  sqsService.ReceiveMessagePollChecker(15000);
  const port = strictEnvs.PORT || 3020;
  
  app.get('/', (req, res) => {
    console.log(`get request coming... on "/" `)
    res.send('Hello from Nodejs Server!! 😁');
  });
  
  app.put("/deploy", ( req, res)=>{
    
    const { githubUrl} = req.body;
  
    if(!githubUrl) return;
  
    const repoId = generateRandomId(12);
  
    // sqs receive messages to run ECS FARGATE Task
    sqsService.sendMessage({ repoId, githubUrl});
  
    return res.json({ 
      status: 'queued', 
      data: { 
        repoId, 
        url: `https://deployer/all-proj-builds/${repoId}/index.html` 
      }
    });
  
  
  })
  
  app.get('/health', (req, res) => {
    console.log("health check done")
    res.send('Everything is good here 💪');
  });
  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

}

start().catch(err =>{
  console.log('Startup error:',err);
  process.exit(1);
})