import { prisma } from "../DB/prisma-client/PrismaClient.js";
import type { Deployment, Project} from "../generated/prisma/client.js";
import type { DeploymentWhereInput, ProjectWhereInput, TeamWhereInput } from "../generated/prisma/models.js";


class DeploymentService{

    public  createNewDeployment = async ( body:any):Promise<any> =>{

        const newDeployment = await prisma.deployment.create({
            data: {
                status: "QUEUED",
                branch: body.branch || "main",
                project_id: body.project_id
            }
        })

        return newDeployment;
    }

    public  getDeploymentById = async ( deploymentId:string)=>{

        return await prisma.deployment.findUnique({ where: { id: deploymentId}});
    }

    

    public  getAllDeploymentByUserIdTeamIdDeploymentId = async ( userId: string, teamId: string, deploymentId:string, page:number, limit:number) =>{

        let skip, paginationQuery;
        if( page && limit){
            skip = ( page-1)*limit;

            paginationQuery = {
                skip: skip,
                take: limit
            }
            
        }

        // main query
        let whereQuery:DeploymentWhereInput = {};
        
        let teamFilter:TeamWhereInput = {};
        let projectFilter:ProjectWhereInput = {};

        if( deploymentId){
            whereQuery.id = deploymentId;
        }

        if( teamId){
            projectFilter.team_id = teamId;
            whereQuery.project = projectFilter;
        }

        if( userId){
            teamFilter.user_id = userId;
            projectFilter.team = teamFilter;
            whereQuery.project = projectFilter;
        }


        let teamsData;

        if( paginationQuery){
            teamsData = await prisma.deployment.findMany({
                where: {
                    ...whereQuery
                },
                ...paginationQuery
            })
        }
        else{
            teamsData = await prisma.deployment.findMany({
                where:{
                    ...whereQuery
                }
            })
        }

        return teamsData;

    }
    
    public  getAllDeployments =  async ( query:any) =>{
        return await prisma.deployment.findMany(query);
    }


}

const deploymentService = new DeploymentService();

export { deploymentService};