import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { optionalEnv, strictEnvs } from "../config/envConfig.js";

const client = new SecretsManagerClient({ 
    region: strictEnvs.AWS_REGION as string,
    credentials: {
        accessKeyId: strictEnvs.AWS_ACCESS_KEY as string,
        secretAccessKey: strictEnvs.AWS_SECRET_KEY as string
    }
});

class SecretManager_Service{

    public async loadSecrets(){
        
        if( !strictEnvs.AWS_REGION || !optionalEnv.AWS_SECRET_MANAGER_SECRET_NAME){ throw new Error("Error Occurs in Secret Manager Initialization") };

        console.log("Loading AWS secrets...");
        const command = new GetSecretValueCommand({ SecretId: optionalEnv.AWS_SECRET_MANAGER_SECRET_NAME});
        
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