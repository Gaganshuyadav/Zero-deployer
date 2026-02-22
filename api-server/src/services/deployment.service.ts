import { prisma } from "../DB/prisma-client/PrismaClient.js";
import type { DeploymentFindManyArgs, DeploymentSelect } from "../generated/prisma/models.js";
import type { CreateNewDeploymentBody } from "../types/req-body/deployment.js";

class DeploymentService{

    public  startNewDeployment = async ( body:CreateNewDeploymentBody):Promise<any> =>{

        const newDeployment = await prisma.deployment.create({
            data: {
                project_id: body.project_id,
                status: body.status,
                branch: body.branch
            }
        })

        return newDeployment;
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