import express from  'express';
import dotenv from "dotenv";
import cors from "cors";
import { ensureEnv} from "./utils/envChecker.js"
import { generateRandomId } from './utils/generate-functions.js';
import { sqsService } from './aws/sqsService.js';
import { secretManagerService } from './aws/secretManagerService.js';

dotenv.config();

const start = async () => {

  if (process.env.AWS_SECRET_MANAGER_EXIST === "1") {
    await secretManagerService.loadSecrets();
  }

//env checker
ensureEnv([
  "AWS_ACCESS_KEY",
  "AWS_SECRET_KEY",
  "AWS_REGION", 
  "AWS_QUEUE_URL",
  "AWS_BUCKET",
  "AWS_ECS_BUILD_CLUSTER_NAME",
  "AWS_ECS_BUILD_TASK_DEFINITION_NAME",
  "AWS_ECS_LAUNCH_TYPE",
  "AWS_ECS_BUILD_ASSIGN_PUBLIC_IP",
  "AWS_ECS_BUILD_SUBNETS_LIST",
  "AWS_ECS_SECURITY_GROUPS_LIST",
  "AWS_ECS_BUILD_TASK_CONTAINER_IMAGE_NAME",
  "ECS_MAX_RUNNING_TASK_COUNT"
]);

const app = express();
app.use(express.json());
app.use(cors());

//run poll checker function
sqsService.ReceiveMessagePollChecker(15000);
const port = process.env.PORT || 3020;

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