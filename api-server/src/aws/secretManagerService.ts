import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { optionalEnv, strictEnvs } from "../config/envConfig.js";

const client = new SecretsManagerClient({ 
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    }
});

class SecretManager_Service{

    public async loadSecrets(){
        
        if( !strictEnvs.AWS_REGION || !strictEnvs.AWS_SECRET_MANAGER_SECRET_NAME){ throw new Error("Error Occurs in Secret Manager Initialization") };

        console.log("Loading AWS secrets...");
        const command = new GetSecretValueCommand({ SecretId: strictEnvs.AWS_SECRET_MANAGER_SECRET_NAME});
        
        const res = await client.send(command);
        const awsSecrets:Record<string,any> = JSON.parse(res.SecretString as string);
        const secretsList = Object.entries(awsSecrets);   
        for( let [ key, value] of secretsList){
          process.env[key] = value;
        } 
    }
}

const secretManagerService = new SecretManager_Service();

export { secretManagerService};