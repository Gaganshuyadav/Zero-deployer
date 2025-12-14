import { ECS, ListTasksCommand, RunTaskCommand, type ListClustersCommandOutput, type ListTasksCommandOutput, type RunTaskCommandInput } from "@aws-sdk/client-ecs";
import { strictEnvs } from "../config/envConfig.js";

const ecsClient = new ECS({
    region: strictEnvs.AWS_REGION as string,
    credentials:{
        accessKeyId: strictEnvs.AWS_ACCESS_KEY as string,
        secretAccessKey: strictEnvs.AWS_SECRET_KEY as string
    }
})

class ECS_Service{

    public async runSingleNewTask( taskParams:RunTaskCommandInput){

        const command = new RunTaskCommand(taskParams);
        const ecsResponse  = await ecsClient.send(command);
        return ecsResponse;

    }

    public async getRunningTaskCount( clusterName:string){
        //List all running tasks in the cluster

        const command:ListTasksCommand = new ListTasksCommand({
            cluster: clusterName,
            desiredStatus: "RUNNING"
        })

        const tasksList:ListTasksCommandOutput = await ecsClient.send(command);
        const runningCount =  tasksList.taskArns?.length ?? 0;
        console.log(`Currently running tasks Count : ${runningCount}`);

        return runningCount;
    }

}

const ecsService = new ECS_Service();

export { ecsService};