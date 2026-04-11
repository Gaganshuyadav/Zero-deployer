import catchAsyncErrors from "../middleware/catch-async.js";
import type { Request, Response} from "express";
import { sseService } from "../services/sseService.js";
import { MyErrorHandler } from "../middleware/error.js";
import { SSE_Clients } from "../states-manager/sse.manager.deployment.js";


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
            res.write(": ping\n\n");
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

        sseService.sendLogsToUser( "1111", { logs:"i am ironman"});

        return res.json({
            error: false,
            message: "Log Send Successfully"
        })

    })

}

const serverSideEvents = new ServerSideEvents();

export { serverSideEvents};

