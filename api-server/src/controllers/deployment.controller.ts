import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import { MyErrorHandler } from "../middleware/error.js";
import { deploymentService } from "../services/deployment.service.js";
import type { DeploymentFindManyArgs, DeploymentSelect} from "../generated/prisma/models.js";

class DeploymentController{

    // public startNewDeployment = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        
    //     const body = req.body;

    //     const newTeam = await deploymentService.createNewDeployment( body);
        
    //     return res.json({
    //         error: false, 
    //         user: newTeam
    //     })

    // })

    public getDeploymentDetails = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{

        const { id} = req.params;

        if(!id){ throw new MyErrorHandler("Deployment Id is not provided", 400);}

        const isDeploymentExist = await deploymentService.isDeploymentExist(id as string);

        if(!isDeploymentExist){ throw new MyErrorHandler("Deployment is not Exist for this given Id",400)};

        // select
        const selectQuery:DeploymentSelect = {
            id: true,
            project_id: true,
            status: true,
            branch: true,
            createdAt: true,
            updatedAt: true
        };

        const getDeployment = await deploymentService.getDeploymentById(isDeploymentExist.id, selectQuery);

        return res.json({ 
            error: false,
            deployment: getDeployment
        })

    }) 

    public getAllDeployments = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{

        // const userId = req?.user?.id;
        // const { isDeployment=false }  = req.body ?? {};

        // // const query:DeploymentFindManyArgs = { 
        // //     where: {
                
        // //     },
        // //     select: {
        // //         id: true,
        // //         team_id : true,
        // //         name: true,
        // //         gitUrl: true,
        // //         subDomain: true,
        // //         customDomain: true,
        // //         createdAt: true,
        // //         updatedAt: true
        // //     }
        // // };

        // // if( query.select && isDeployment){
        // //     query.select.deployment = true
        // // }
  

        // const allTeams = await deploymentService.getAllDeployments( query);

        // return res.json({ 
        //     error: false,
        //     teams: allTeams
        // });
    })

    public getAllDeploymentsByUser = catchAsyncErrors
}

const deploymentController = new DeploymentController();

export { deploymentController};