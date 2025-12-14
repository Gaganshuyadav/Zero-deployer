import dotenv from "dotenv";
dotenv.config();
import { ensureEnv} from "../utils/envChecker.js";
import { secretManagerService } from '../aws/secretManagerService.js';

const strictEnvs = {
        PORT: process.env.PORT,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
        AWS_REGION: process.env.AWS_REGION, 
        AWS_QUEUE_URL: process.env.AWS_QUEUE_URL,
        AWS_BUCKET: process.env.AWS_BUCKET,
        AWS_ECS_BUILD_CLUSTER_NAME: process.env.AWS_ECS_BUILD_CLUSTER_NAME,
        AWS_ECS_BUILD_TASK_DEFINITION_NAME: process.env.AWS_ECS_BUILD_TASK_DEFINITION_NAME,
        AWS_ECS_LAUNCH_TYPE: process.env.AWS_ECS_LAUNCH_TYPE,
        AWS_ECS_BUILD_ASSIGN_PUBLIC_IP: process.env.AWS_ECS_BUILD_ASSIGN_PUBLIC_IP,
        AWS_ECS_BUILD_SUBNETS_LIST: process.env.AWS_ECS_BUILD_SUBNETS_LIST ,
        AWS_ECS_SECURITY_GROUPS_LIST: process.env.AWS_ECS_SECURITY_GROUPS_LIST,
        AWS_ECS_BUILD_TASK_CONTAINER_IMAGE_NAME: process.env.AWS_ECS_BUILD_TASK_CONTAINER_IMAGE_NAME ,
        ECS_MAX_RUNNING_TASK_COUNT: process.env.ECS_MAX_RUNNING_TASK_COUNT
};

const optionalEnv = {
    AWS_SECRET_MANAGER_EXIST: process.env.AWS_SECRET_MANAGER_EXIST,
    AWS_SECRET_MANAGER_SECRET_NAME: process.env.AWS_SECRET_MANAGER_SECRET_NAME
};

let ENV = {

}



// initialize config
const initConfig = async ()=>{

    if (process.env.AWS_SECRET_MANAGER_EXIST === "1") {
        await secretManagerService.loadSecrets();
    }

    //env checker
    ensureEnv(strictEnvs);

    // make ENV for export
    // const addStrictEnv = Object.fromEntries(strictEnvs.map((e)=>[e,`process.env.${e}`]));
    // const addoptionalEnv = Object.fromEntries(strictEnvs.map((e)=>[e,`process.env.${e}`]));

    // ENV = { ...addStrictEnv, addoptionalEnv};

}


export { strictEnvs, optionalEnv, initConfig};