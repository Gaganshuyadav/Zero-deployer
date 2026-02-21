import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import { MyErrorHandler } from "../middleware/error.js";
import { projectService } from "../services/project.service.js";

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

        if(!id){ throw new MyErrorHandler("Team Id is not provided", 400);}

        // const isTeamExist = await projectService.IsTeamExist(id as string);

        // if(!isTeamExist){ throw new MyErrorHandler("Team is not Exist for this given Id",400)};

        // const findTeam = await teamService.getTeamById( id as string );

        return res.json({ 
            error: false,
            // team: findTeam
        })

    }) 

    public getAllProjects = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{

        // const allTeams = await teamService.getAllTeams({
        //     where: {
        //         user_id: userId as string
        //     }
        // });

        return res.json({ 
            error: false,
            // teams: allTeams
        });
    })

    public getAllProjectsByUser = catchAsyncErrors
}

const projectController = new ProjectController();

export { projectController};