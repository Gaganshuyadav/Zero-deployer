import { prisma } from "../DB/prisma-client/PrismaClient.js";
import type { Project} from "../generated/prisma/client.js";
import type { ProjectFindManyArgs, ProjectSelect, ProjectWhereInput, TeamWhereInput } from "../generated/prisma/models.js";
import type { CreateNewProjectBody } from "../types/req-body/project.js";

class ProjectService{

    public  createNewProject = async ( body:CreateNewProjectBody):Promise<any> =>{

        const newProject = await prisma.project.create({
            data: {
                name: body.name,
                team_id: body.team_id,
                gitUrl: body.gitUrl,
                subDomain: body.subDomain,
                customDomain: body.customDomain
            }
        })

        return newProject;
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