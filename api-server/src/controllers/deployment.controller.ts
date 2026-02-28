import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import { MyErrorHandler } from "../middleware/error.js";
import { deploymentService } from "../services/deployment.service.js";
import type { DeploymentFindManyArgs, DeploymentSelect} from "../generated/prisma/models.js";
import type { CreateNewDeploymentReqBody } from "../types/reqTypes/deployment.js";

class DeploymentController{

    public startNewDeployment = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        
        const body:CreateNewDeploymentReqBody = req.body;

        const newDep = await deploymentService.startNewDeployment( body);
        
        return res.json({
            error: false,
            newDep
        })

    })

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

        const userId = req?.user?.id;
        const { projectId, teamId }  = req.body ?? {};

        const query:DeploymentFindManyArgs = { 
            where: {
               project: {
                team: {
                    user_id: userId as string,
                    ...( teamId && { id: teamId} )
                },
                ...( projectId && { id: projectId})
               } 
            },
            select: {
                id: true,
                project_id: true,
                status: true,
                branch: true,
                createdAt: true,
                updatedAt: true
            }
        };

        const allDeployments = await deploymentService.getAllDeployments( query);

        return res.json({ 
            error: false,
            deployments: allDeployments
        });
    })

}

const deploymentController = new DeploymentController();

export { deploymentController};