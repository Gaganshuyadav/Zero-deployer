import { sqsService } from "../aws/sqsService.js";
import { prisma } from "../DB/prisma-client/PrismaClient.js";
import type { Project, Deployment} from "../generated/prisma/client.js";
import type { ProjectFindManyArgs, ProjectSelect, ProjectWhereInput, TeamWhereInput } from "../generated/prisma/models.js";
import type { RequestUser } from "../types/customTypes/user.js";
import type { CreateNewProjectReqBody } from "../types/reqTypes/project.js";
import { deploymentService } from "./deployment.service.js";

class ProjectService{

    public  createNewProject = async ( { projectBody, userBody }:{ projectBody:CreateNewProjectReqBody, userBody:RequestUser } ):Promise< { project: Project, deployment: Deployment} | any | void> =>{

        // create new project
        const newProject = await prisma.project.create({
            data: {
                name: projectBody.name,
                team_id: projectBody.team_id,
                gitUrl: projectBody.gitUrl,
                subDomain: projectBody.subDomain,
                customDomain: projectBody.customDomain
            }
        })


        // create new deloyment 
        const newDep = await deploymentService.startNewDeployment({
            project_id: newProject.id,
            status: "QUEUED",
            branch: newProject.id
        })

        // return newProject;

        // generate random repoId
        const generatedRepoid = `${projectBody.name.replace(" ","-")}-${Math.floor(Math.random()*1000000)}`;


        // send message into SQS to run ECS container and start build for new project
        sqsService.sendMessage({
            repoId: generatedRepoid,
            githubUrl: projectBody.gitUrl,
            user_id: userBody.id,
            project_id: newProject.id,
            deployment_id: newDep.id
        })

        // return { project: newProject, deployment: newDep};
        return { project: newProject, deployment: newDep, ecsPayload: { repoId: generatedRepoid, githubUrl: projectBody.gitUrl, user_id: userBody.id, project_id: newProject.id, deployment_id: newDep.id }};
 

    }


    public isProjectExist = async ( projectId: string):Promise<{ id:string} | null> =>{
        return await prisma.project.findUnique({ where: { id: projectId}, select: { id: true}});
    }

    public  getProjectById = async ( deploymentId:string, selectQuery:ProjectSelect)=>{
            
        const getProjectDetail = await prisma.project.findUnique({
            where: {
                id: deploymentId
            },
            // select: {
            //     ...selectQuery
            // }
        })

        return getProjectDetail;
    }

    

    public  getProjectByUserIdOrTeamId = async ( userId: string, teamId: string, page:number, limit:number) =>{

        let skip, paginationQuery;
        if( page && limit){
            skip = ( page-1)*limit;

            paginationQuery = {
                skip: skip,
                take: limit
            }
            
        }

        // main query
        let whereQuery:ProjectWhereInput = {};
        
        let teamFilter:TeamWhereInput = {};

        if( userId){
            teamFilter.user_id = userId;
            whereQuery.team = teamFilter;
        }

        if( teamId){
            whereQuery.team_id = teamId;
        }


        let teamsData;

        if( paginationQuery){
            teamsData = await prisma.project.findMany({
                where: {
                    ...whereQuery
                },
                ...paginationQuery
            })
        }
        else{
            teamsData = await prisma.project.findMany({
                where:{
                    ...whereQuery
                }
            })
        }

        return teamsData;

    }

    public  getAllProjects = async ( query:ProjectFindManyArgs, page?:number, limit?:number) =>{

        let skip, paginationQuery;
        if( page && limit){
            skip = ( page-1)*limit;

            paginationQuery = {
                skip: skip,
                take: limit
            }   
        }

        let allProjectsData;

        if( paginationQuery){
            allProjectsData = await prisma.project.findMany({
                ...paginationQuery,
                ...query
            })
        }
        else{
            allProjectsData = await prisma.project.findMany({
                ...query
            })
        }

        return allProjectsData;
    }


}

const projectService = new ProjectService();

export { projectService};