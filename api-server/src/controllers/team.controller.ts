import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import { MyErrorHandler } from "../middleware/error.js";
import type { Deployment } from "../generated/prisma/client.js";
import { teamService } from "../services/team.service.js";
import type { createNewUserBody } from "../types/req-body/user.js";
import type { CreateNewTeamBody } from "../types/req-body/team.js";

class TeamController{

    public createNewTeam = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        
        const body:CreateNewTeamBody = req.body;

        const newTeam = await teamService.createNewTeam( body, req.user?.id as string);
        
        return res.json({
            error: false, 
            user: newTeam
        })

    })

    public getTeam = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{

        const { id} = req.params;

        if(id){ throw new MyErrorHandler("Team Id is not provided", 400);}

        const isTeamExist = await teamService.IsTeamExist(id as string);

        if(!isTeamExist){ throw new MyErrorHandler("Team is not Exist for this given Id",400)};

        const findTeam = await teamService.getTeamById( id as string );

        return res.json({ 
            error: false,
            team: findTeam
        })

    }) 

    public getAllTeams = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{

        const allTeams = await teamService.getAllTeams();

        return res.json({ 
            error: false,
            teams: allTeams
        });
    })
}

const teamController = new TeamController();

export { teamController};