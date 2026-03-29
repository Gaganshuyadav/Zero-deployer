import type { UUID } from "crypto";
import { sqsService } from "../aws/sqsService.js";
import { prisma } from "../DB/prisma-client/PrismaClient.js";
import type { Deployment, Project } from "../generated/prisma/client.js";
import type { DeploymentFindManyArgs, DeploymentSelect } from "../generated/prisma/models.js";
import type { RequestUser } from "../types/customTypes/user.js";
import type { CreateNewDeploymentReqBody } from "../types/reqTypes/deployment.js";
import { projectService } from "./project.service.js";

class DeploymentService{

    public  startNewDeployment = async ( 
        body:CreateNewDeploymentReqBody, 
        user:RequestUser
    ):Promise< { 
        project:Project, 
        deployment: Deployment, 
        ecsPayload: {
            repoId: string, 
            githubUrl: string,
            user_id: UUID,
            project_id: UUID,
            deployment_id: UUID
        }
    }> =>{

        const newDeployment = await prisma.deployment.create({
            data: {
                project_id: body.project_id,
                status: "QUEUED",
                branch: body.branch
            }
        })

        // find project id
        const findProj = await projectService.getProjectById( body.project_id) as Project;

        
        // generate random repoId
        const generatedRepoid = `${findProj?.name.replace(" ","-")}-${Math.floor(Math.random()*1000000)}`;

        // send message into SQS to run ECS container and start build for new project
        // sqsService.sendMessage({
        //     repoId: generatedRepoid,
        //     githubUrl: findProj?.gitUrl as string,
        //     user_id: user.id,
        //     project_id: findProj?.id as UUID,
        //     deployment_id: newDeployment.id
        // })

        return { 
            project: findProj,
            deployment: newDeployment, 
            ecsPayload: { 
                repoId: generatedRepoid, 
                githubUrl: findProj?.gitUrl, 
                user_id: user.id as UUID, 
                project_id: findProj?.id as UUID, 
                deployment_id: newDeployment.id as UUID
            }
        };
    }

    public  getDeploymentById = async ( deploymentId:string, selectQuery:DeploymentSelect)=>{
        
        const getDeploymentDetail = await prisma.deployment.findUnique({
            where: {
                id: deploymentId
            },
            select: {
                ...selectQuery
            }
        })

        return getDeploymentDetail;
    }

    public isDeploymentExist = async ( deploymentId: string):Promise<{ id:string} | null> =>{
        return await prisma.deployment.findUnique({ where: { id: deploymentId}, select: { id: true}});
    }

    public  getAllDeployments = async ( query:DeploymentFindManyArgs, page?:number, limit?:number) =>{

        let skip, paginationQuery;
        if( page && limit){
            skip = ( page-1)*limit;

            paginationQuery = {
                skip: skip,
                take: limit
            }   
        }

        let allDeploymentsData;

        if( paginationQuery){
            allDeploymentsData = await prisma.deployment.findMany({
                ...paginationQuery,
                ...query
            })
        }
        else{
            allDeploymentsData = await prisma.deployment.findMany({
                ...query
            })
        }

        return allDeploymentsData;
    }


}

const deploymentService = new DeploymentService();

export { deploymentService};