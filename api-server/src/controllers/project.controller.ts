import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import { MyErrorHandler } from "../middleware/error.js";
import { projectService } from "../services/project.service.js";
import type { ProjectFindManyArgs, ProjectSelect} from "../generated/prisma/models.js";

class ProjectController{

    public createNewProject = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        
        const body = req.body;

        const newTeam = await projectService.createNewProject( body);
        
        return res.json({
            error: false, 
            user: newTeam
        })

    })

    public getProjectDetails = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{

        const { id} = req.params;

        if(!id){ throw new MyErrorHandler("Project Id is not provided", 400);}

        const isProjectExist = await projectService.isProjectExist(id as string);

        if(!isProjectExist){ throw new MyErrorHandler("Project is not Exist for this given Id",400)};

        // select
        const selectQuery:ProjectSelect = {
            id: true,
            team_id: true,
            name: true,
            gitUrl: true,
            subDomain: true,
            customDomain: true,
            createdAt: true,
            updatedAt: true
        };

        const getProject = await projectService.getProjectById(id, selectQuery)


        return res.json({ 
            error: false,
            project: getProject
        })

    }) 

    public getAllProjects = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{

        const userId = req?.user?.id;
        const { isDeployment=false, teamId }  = req.body ?? {};

        const query:ProjectFindManyArgs = { 
            where: {
                ...( teamId && { team_id: teamId}),
                team: {
                    user_id: userId as string
                }
            },
            select: {
                id: true,
                team_id : true,
                name: true,
                gitUrl: true,
                subDomain: true,
                customDomain: true,
                createdAt: true,
                updatedAt: true,
                ...( isDeployment && { deployment: true})
            }
        };
  

        const allTeams = await projectService.getAllProjects( query);

        return res.json({ 
            error: false,
            teams: allTeams
        });
    })

    public getAllProjectsByUser = catchAsyncErrors
}

const projectController = new ProjectController();

export { projectController};