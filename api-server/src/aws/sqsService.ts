import { DeleteMessageCommand, GetQueueAttributesCommand, ReceiveMessageCommand, SendMessageCommand, SQS, type ReceiveMessageCommandOutput} from "@aws-sdk/client-sqs";
import { ecsService } from "./ecsService.js";
import type { AssignPublicIp, AwsVpcConfiguration, LaunchType } from "@aws-sdk/client-ecs";
import type { SqsDeployMessage } from "../types/interfaces/message.js";
import { optionalEnv, strictEnvs } from "../config/envConfig.js";

const sqsClient = new SQS({
    region: process.env.AWS_REGION as string,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    }
});

class SQS_Service{

    //producer
    public async sendMessage( message:any){

        if( optionalEnv.AWS_SQS_SERVICE_EXIST!=='1'){ console.log("send Message in local"); return;}

        const sendParams = {
            QueueUrl: strictEnvs.AWS_QUEUE_URL,
            MessageBody: JSON.stringify(message)
        }

        const sendCommand = new SendMessageCommand(sendParams);
        const response = await sqsClient.send(sendCommand);
        console.log("Message sent, ID: ",response.MessageId);

        //only for message that contains repoid and github 
        console.log("Repo Id: ", message?.repoId ? message.repoId : " ");
    }

    //consumer
    public async ReceiveMessagePollChecker( pollTime:number=5000){

        console.log(" Polling checker started... ");

        // if( optionalEnv.AWS_SQS_SERVICE_EXIST!=='1'){ console.log("sqs running in local"); return;}

        setInterval( async ()=>{
    
            const runningTaskCount = await ecsService.getRunningTaskCount( strictEnvs.AWS_ECS_BUILD_CLUSTER_NAME as string);
            const maxRunningTask= Number(strictEnvs.ECS_MAX_RUNNING_TASK_COUNT) || 200;
            const queueDepth = await this.getCurrentApproxTotalMessagesFromQueue( strictEnvs.AWS_QUEUE_URL as string);
    
            const availableSlots = Math.max( 0, maxRunningTask - runningTaskCount);
            const tasksToStart = Math.min( queueDepth, availableSlots);
    
            // if already at or above limit -> skip polling
            if( tasksToStart===0){
                if(runningTaskCount>0){ console.log("Max Concurrency reached. Stop Receiving Messages"); }
                else{ console.log("Currently Queue is Empty. Stop Receiving Messages"); }
                return;
            }
    
    
            // Queue Params ( Receive and process that many messages)
            const receiveQueueParams = {
                QueueUrl: strictEnvs.AWS_QUEUE_URL,
                MaxNumberOfMessages: Math.min( tasksToStart, 10),
                WaitTimeSeconds: 0
            }
    
    
            // safe to poll messages from SQS
            try{
                console.log("Receiving Messages... ");
                const receiveCommand = new ReceiveMessageCommand(receiveQueueParams);
                const sqsReceiveData:ReceiveMessageCommandOutput = await sqsClient.send(receiveCommand);
                console.log("SQS Received Data: ",sqsReceiveData?.Messages ? sqsReceiveData?.Messages?.length : 0 );
    
                if( sqsReceiveData?.Messages && sqsReceiveData?.Messages?.length > 0){
                    for(let i=0; i<sqsReceiveData?.Messages?.length; i++){
    
                        if( sqsReceiveData.Messages[i]?.Body){

                            const receivedMessage:SqsDeployMessage = JSON.parse(sqsReceiveData.Messages[i]?.Body as string);
                            console.log("this is received message", receivedMessage );

                            if( !receivedMessage.repoId || !receivedMessage.githubUrl){
                                console.log("Either repoId or githubUrl not provided in message body");
                                return;
                            }
    
                            // ECS task
                            const ecsResponse = await ecsService.runSingleNewTask({
                                cluster: strictEnvs.AWS_ECS_BUILD_CLUSTER_NAME,
                                taskDefinition: strictEnvs.AWS_ECS_BUILD_TASK_DEFINITION_NAME,
                                launchType: strictEnvs.AWS_ECS_LAUNCH_TYPE as LaunchType,
                                networkConfiguration: {
                                    awsvpcConfiguration: {
                                        assignPublicIp: strictEnvs.AWS_ECS_BUILD_ASSIGN_PUBLIC_IP as AssignPublicIp,
                                        subnets: JSON.parse(strictEnvs.AWS_ECS_BUILD_SUBNETS_LIST || '[]') as Array<string>,
                                        securityGroups: JSON.parse(strictEnvs.AWS_ECS_SECURITY_GROUPS_LIST || '[]') as Array<string>
                                    }
                                },
                                overrides: {
                                    containerOverrides: [
                                        {
                                            name: strictEnvs.AWS_ECS_BUILD_TASK_CONTAINER_IMAGE_NAME,
                                            environment: [
                                                { name: "GITHUB_REPOSITORY_URL", value: receivedMessage.githubUrl },
                                                { name: "REPO_ID", value: receivedMessage.repoId },
                                                { name: "AWS_ACCESS_KEY", value: strictEnvs.AWS_ACCESS_KEY },
                                                { name: "AWS_SECRET_KEY", value: strictEnvs.AWS_SECRET_KEY },
                                                { name: "AWS_REGION", value: strictEnvs.AWS_REGION },
                                                { name: "AWS_BUCKET", value: strictEnvs.AWS_BUCKET },
                                                { name: "SERVER_USER_ID", value: `user_id_${Math.ceil((Math.random())*10000000000)}`},
                                                { name: "SERVER_PROJECT_ID", value: `project_id_${Math.ceil((Math.random())*10000000000)}`},
                                                { name: "SERVER_DEPLOYMENT_ID", value: `deployment_id_${Math.ceil((Math.random())*10000000000)}`}
                                            ]
                                        }
                                    ]
                                }
                            })
    
                            console.log("ECS Response: ",ecsResponse);
    
                            //delete message from queue
                            await this.deleteMessage(sqsReceiveData.Messages[i]?.ReceiptHandle as string);
                        }
                    }
                }
    
    
    
            }
            catch(err){
                console.log("Error Receiving Messages: ", err);
            }
    
        }, pollTime);
    }

    //delete from queue
    public async deleteMessage( ReceiptHandle:string){
        
        if(!ReceiptHandle) return;

        const params = {
            QueueUrl: strictEnvs.AWS_QUEUE_URL,
            ReceiptHandle: ReceiptHandle
        }

        const deleteCommand = new DeleteMessageCommand(params);
    
        await sqsClient.send(deleteCommand);
        console.log("Message deleted from queue successfully")
    }

    
    // get count of (current messages in queue) 
    public async getCurrentApproxTotalMessagesFromQueue( queueUrl:string):Promise<number>{
        
        const command = new GetQueueAttributesCommand({
            QueueUrl: queueUrl,
            AttributeNames: ["ApproximateNumberOfMessages"]
        })

        const res = await sqsClient.send(command);
        return Number(res.Attributes?.ApproximateNumberOfMessages) || 0;
    }
}

const sqsService = new SQS_Service();
export { sqsService};