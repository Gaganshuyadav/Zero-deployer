
import dotenv from "dotenv";
dotenv.config();
import { loadSecrets } from '../services/aws/Secret_Manager';

const strictEnvs = {
        GITHUB_REPOSITORY_URL: process.env.GITHUB_REPOSITORY_URL,
        REPO_ID: process.env.REPO_ID,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
        AWS_REGION: process.env.AWS_REGION,
        AWS_BUCKET: process.env.AWS_BUCKET,
        AWS_SECRET_MANAGER_SECRET_NAME: process.env.AWS_SECRET_MANAGER_SECRET_NAME,
        SERVER_USER_ID: process.env.SERVER_USER_ID,
        SERVER_PROJECT_ID: process.env.SERVER_PROJECT_ID,
        SERVER_DEPLOYMENT_ID: process.env.SERVER_DEPLOYMENT_ID
};

const optionalEnv = {
    AWS_SECRET_MANAGER_EXIST: process.env.AWS_SECRET_MANAGER_EXIST,
    AWS_SQS_SERVICE_EXIST: process.env.AWS_SQS_SERVICE_EXIST
};




const ensureEnv  = ( required=[], message="Missing environment variables: ")=>{

    const missing = required.filter(envName=>( !process.env[envName] || process.env[envName].trim()===""));
    if(missing.length){
        const msg = `${message}${missing.join(", ")}`;
        console.error(msg);
        throw new Error(msg);
    }
}



// initialize config
const initConfig = async ()=>{

    if (process.env.AWS_SECRET_MANAGER_EXIST === "1") {
        await loadSecrets();
    }

    //env checker
    ensureEnv(strictEnvs);

}


export { strictEnvs, optionalEnv, initConfig};