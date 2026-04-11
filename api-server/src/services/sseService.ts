import { error } from "console";
import { SSE_Clients, testingLastEventId } from "../states-manager/sse.manager.deployment.js";
import type { Response } from "express";

class SSE_Service{

    public addClient( deploymentId:string, res:Response){
    
        if( !SSE_Clients.has( deploymentId)){
            SSE_Clients.set( deploymentId, new Set());
        }
    
        SSE_Clients.get( deploymentId)?.add( res);
        
    }
    
    public removeClient( deploymentId:string, res:Response):boolean{
    
        const setData = SSE_Clients.get(deploymentId);
    
        if( !SSE_Clients.has( deploymentId)){
            return false;
        }
    
        setData?.delete(res);
    
        if( setData?.size ===0){
            SSE_Clients.delete(deploymentId);
        }
        return true;
    }
    
    public sendLogsToUser( deploymentId:string, logData:any){
    
        const deploymentResponse = SSE_Clients.get( deploymentId);
    
        if(!deploymentResponse) return;
    
        const payload = `data: ${JSON.stringify(logData)}\n\n`;

        console.log("Payload:::: ",payload, " for ID: ", deploymentId);
    
        deploymentResponse.forEach( (res:Response) =>{

            try{
                res.write(`id: ${deploymentId}\n`);
                res.write(payload);
            }
            catch(err){
                console.error(error);
                console.log("Error comes in Server Side Events service");
            }
        })
    }

}

const sseService = new SSE_Service();

export { sseService};
