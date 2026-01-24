import type { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "./catch-async.js";
import { MyErrorHandler } from "./error.js";


const authenticate = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction)=>{

    const token = req.headers?.authorization?.split(" ")[1];

    if( token){
        throw new MyErrorHandler("Authentication Failed", 400);
    }


    try{
       next();
    }
    catch(err){
       throw new MyErrorHandler("i am custom error", 5000);
    }

})


export  { authenticate};