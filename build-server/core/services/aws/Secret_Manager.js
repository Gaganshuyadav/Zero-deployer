const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { produceLogs } = require("../kafka/Kafka_Log_Service");

const client = new SecretsManagerClient({ 
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY ,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

exports.loadSecrets = async ()=>{

    if( !process.env.AWS_REGION || !process.env.AWS_SECRET_MANAGER_SECRET_NAME){ throw new Error("Error Occurs in Secret Manager Initialization") };

    await produceLogs("Loading AWS secrets...","INFO");
    const command = new GetSecretValueCommand({ SecretId: process.env.AWS_SECRET_MANAGER_SECRET_NAME});
    
    const res = await client.send(command);
    const awsSecrets = JSON.parse(res.SecretString);
    const secretsList = Object.entries(awsSecrets);   
    for( let [ key, value] of secretsList){
      process.env[key] = value;
    }  

}