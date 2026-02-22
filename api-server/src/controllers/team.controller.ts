import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import { MyErrorHandler } from "../middleware/error.js";
import { teamService } from "../services/team.service.js";
import type { createNewUserBody } from "../types/req-body/user.js";
import type { CreateNewTeamBody } from "../types/req-body/team.js";
import type { TeamFindManyArgs } from "../generated/prisma/models.js";

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

        if(!id){ throw new MyErrorHandler("Team Id is not provided", 400);}

        const isTeamExist = await teamService.IsTeamExist(id as string);

        if(!isTeamExist){ throw new MyErrorHandler("Team is not Exist for this given Id",400)};

        const findTeam = await teamService.getTeamById( id as string );

        return res.json({ 
            error: false,
            team: findTeam
        })

    }) 

    public getAllTeams = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{

        const userId = req.user?.id;

        const { isProject=false } = req.body ?? {};
        

        const query:TeamFindManyArgs = { 
            where: { user_id: userId as string}, 
            select: {
                id: true,
                name: true,
                type: true,
                createdAt: true,
                updatedAt: true,
                user_id: true
            }
        };

        //select
        if(isProject && query.select){
            query.select.project = true;
        }

        const allTeams = await teamService.getAllTeams(query);

        return res.json({ 
            error: false,
            teams: allTeams
        });
    })
}

const teamController = new TeamController();

export { teamController};