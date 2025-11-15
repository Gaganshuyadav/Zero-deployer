import { DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQS, type ReceiveMessageCommandOutput} from "@aws-sdk/client-sqs";
import { ecsService } from "./ecsService.js";
import type { AssignPublicIp, AwsVpcConfiguration, LaunchType } from "@aws-sdk/client-ecs";

const sqsClient = new SQS({
    region: process.env.AWS_REGION as string,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    }
});

//producer
export const sendMessage = async( message:{ repoId:string, githubUrl:string})=>{

    const sendParams = {
        QueueUrl: process.env.AWS_QUEUE_URL,
        MessageBody: JSON.stringify(message)
    }

    const sendCommand = new SendMessageCommand(sendParams);
    const response = await sqsClient.send(sendCommand);
    console.log("Message sent, ID: ",response.MessageId);
    console.log("Repo Id: ", message.repoId);
}


//consumer
export const pollChecker = async ( pollTime:number=5000)=>{

    console.log(" Polling checker started... ");

    setTimeout( async ()=>{

        const receiveParams = {
            QueueUrl: process.env.AWS_QUEUE_URL,
            MaxNumberOfMessages: 2
        }

        const runningTaskCount = await ecsService.getRunningTaskCount( process.env.AWS_ECS_BUILD_CLUSTER_NAME as string);
        const maxRunningTask= Number(process.env.ECS_MAX_RUNNING_TASK_COUNT) || 200;

        // if already at or above limit -> skip polling
        if( runningTaskCount >= maxRunningTask){
            console.log("Max Concurrency reached. Stop Receiving Messages");
            return;
        }

        // safe to poll messages from SQS
        try{
            console.log("Receiving Messages... ");
            const receiveCommand = new ReceiveMessageCommand(receiveParams);
            const sqsReceiveData:ReceiveMessageCommandOutput = await sqsClient.send(receiveCommand);
            console.log("SQS Received Data: ",sqsReceiveData?.Messages ? sqsReceiveData?.Messages?.length : 0 );

            if( sqsReceiveData?.Messages && sqsReceiveData?.Messages?.length > 0){
                for(let i=0; i<sqsReceiveData?.Messages?.length; i++){

                    if( sqsReceiveData.Messages[i]?.Body){
                        console.log("this is received message", JSON.parse(sqsReceiveData.Messages[i]?.Body as string));

                        // ECS task
                        const ecsResponse = await ecsService.runSingleNewTask({
                            cluster: process.env.AWS_ECS_BUILD_CLUSTER_NAME,
                            taskDefinition: process.env.AWS_ECS_BUILD_TASK_DEFINITION_NAME,
                            launchType: process.env.AWS_ECS_LAUNCH_TYPE as LaunchType,
                            networkConfiguration: {
                                awsvpcConfiguration: {
                                    assignPublicIp: process.env.AWS_ECS_BUILD_ASSIGN_PUBLIC_IP as AssignPublicIp,
                                    subnets: JSON.parse(process.env.AWS_ECS_SECURITY_GROUPS_LIST || '[]') as Array<string>,
                                    securityGroups: JSON.parse(process.env.AWS_ECS_SECURITY_GROUPS_LIST || '[]') as Array<string>
                                }
                            },
                            overrides: {
                                containerOverrides: [
                                    {
                                        name: process.env.REPO_ID,
                                        environment: [
                                            { name: "GITHUB_REPOSITORY_URL", value: process.env.GITHUB_REPOSITORY_URL },
                                            { name: "REPO_ID", value: process.env.REPO_ID},
                                            { name: "AWS_ACCESS_KEY", value: process.env.AWS_ACCESS_KEY },
                                            { name: "AWS_SECRET_KEY", value: process.env.AWS_SECRET_KEY },
                                            { name: "AWS_REGION", value: process.env.AWS_REGION },
                                            { name: "AWS_BUCKET", value: process.env.AWS_BUCKET },
                                        ]
                                    }
                                ]
                            }
                        })

                        console.log("ECS Response: ",ecsResponse);

                        //delete message from queue
                        await deleteMessage(sqsReceiveData.Messages[i]?.ReceiptHandle as string);
                    }
                }
            }



        }
        catch(err){
            console.log("Error Receiving Messages: ", err);
        }

    }, pollTime);
}

//run poll checker function
pollChecker(15000);

//delete from queue
export const deleteMessage = async ( ReceiptHandle:string)=>{

    if(!ReceiptHandle) return;

    const params = {
        QueueUrl: process.env.AWS_QUEUE_URL,
        ReceiptHandle: ReceiptHandle
    }

    const deleteCommand = new DeleteMessageCommand(params);

    await sqsClient.send(deleteCommand);
    console.log("Message deleted from queue successfully")
}