import { DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQS} from "@aws-sdk/client-sqs";

const sqsClient = new SQS({
    region: process.env.AWS_REGION as string,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    }
});

//producer
export const sendMessage = async( message:object)=>{

    const sendParams = {
        QueueUrl: process.env.AWS_QUEUE_URL,
        MessageBody: JSON.stringify(message)
    }

    const sendCommand = new SendMessageCommand(sendParams);
    const response = await sqsClient.send(sendCommand);
    console.log("Message sent, ID: ",response.MessageId);
}


//consumer
export const pollMessages = async ( pollTime:number=5000)=>{

    console.log(" Polling messages... ");

    setInterval( async ()=>{

        const receiveParams = {
            QueueUrl: process.env.AWS_QUEUE_URL,
            MaxNumberOfMessages: 2
        }

        try{

            const receiveCommand = new ReceiveMessageCommand(receiveParams);
            const sqsReceiveData = await sqsClient.send(receiveCommand);
            console.log("SQS Received Data: ",sqsReceiveData?.Messages ? sqsReceiveData?.Messages?.length : 0 );

            if(sqsReceiveData.Messages && sqsReceiveData.Messages.length>0){
                for(let i=0; i<sqsReceiveData.Messages.length; i++){

                    if( sqsReceiveData.Messages[i]?.Body){
                        console.log("this is received message", JSON.parse(sqsReceiveData.Messages[i]?.Body as string));

                        //promise of 15 seconds act as ECS task
                        await new Promise(( resolve, reject)=>{
                            setTimeout(()=>{
                                resolve("resolved");
                            },15000);
                        })

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

//run poll messages function
pollMessages(5000);

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