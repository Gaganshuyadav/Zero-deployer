import catchAsyncErrors from "../middleware/catch-async.js";
import type { Request, Response} from "express";
import { sseService } from "../services/sseService.js";
import { MyErrorHandler } from "../middleware/error.js";
import { SSE_Clients } from "../states-manager/sse.manager.deployment.js";
import { redisClient } from "../config/redisClient.js";


class ServerSideEvents{

    public getRealTimeDeploymentLogs = catchAsyncErrors( async ( req:Request, res:Response) =>{

        const deploymentId = req.query.deploymentId as string;

        if(!deploymentId){ throw new MyErrorHandler("DeploymentId not provided", 400)};

        // SSE Header
        res.writeHead( 200, {
            "content-type":"text/event-stream",
            "cache-control":"no-cache",
            "connection":"keep-alive"
        })

        // add client to the SSE
        sseService.addClient( deploymentId, res);

        // heartbeat ( keep connection alive)
        const heartBeat = setInterval( ()=>{
            res.write(`: ping: ${deploymentId}\n\n`);
        }, 15000);

        
        req.on("close", ()=>{
            console.log("Connection Closed...");
            clearInterval( heartBeat);
            sseService.removeClient(deploymentId, res);
            res.end("Connection Closed");
        })

        // console.log("------------------------- ",SSE_Clients);

        return res.write(": Connected Successfully\n\n");

    });

    public createLog = catchAsyncErrors( async( req:Request, res:Response)=>{

        const { deploymentId, messageBody} = req.body;

        try{
            await redisClient?.publish("sse-publish-logs", JSON.stringify({ data: messageBody, "deploymentId": deploymentId } ) );

            return res.json({
                error: false,
                message: "Log Send Successfully"
            })
        }
        catch(err){
            console.log("Redis Publisher not able to publish data");
            throw new MyErrorHandler( "Not Able to Send Logs", 500);
        }


    })

}

const serverSideEvents = new ServerSideEvents();

export { serverSideEvents};

