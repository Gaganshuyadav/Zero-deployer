
const dotenv = require("dotenv");
dotenv.config();
const { loadSecrets } = require('../services/aws/Secret_Manager');

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
    AWS_S3_SERVICE_EXIST: process.env.AWS_S3_SERVICE_EXIST,
    IS_KAFKA_EXIST: process.env.IS_KAFKA_EXIST
};




const ensureEnv  = ( required=[], message="Missing environment variables: ")=>{

    console.log("*************** ",required);

    const missing = required.filter(envName=>( !process.env[envName] || process.env[envName].trim()===""));
    if(missing.length){
        const msg = `${message}${missing.join(", ")}`;
        console.error(msg);
        throw new Error(msg);
    }
}



// initialize config
const initConfig_with_envChecking = async ()=>{

    if (process.env.AWS_SECRET_MANAGER_EXIST === "1") {
        await loadSecrets();
    }

    //env checker
    ensureEnv(Object.keys(strictEnvs));

}


module.exports = { strictEnvs, optionalEnv, initConfig_with_envChecking};