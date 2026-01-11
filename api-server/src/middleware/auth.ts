import type { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "./catch-async.js";
import { MyErrorHandler } from "./error.js";


const authenticate = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction)=>{

    console.log("reqBody: ", req.body);

    if( req.body.message==="call"){
       next();
    }

    if( req.body.message==="call1"){
        throw new Error("i am not custom error");
    }
    else{
        throw new MyErrorHandler("i am custom error", 5000);
    }
    
    


})


export  { authenticate};