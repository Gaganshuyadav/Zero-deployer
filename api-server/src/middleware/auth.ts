import type { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "./catch-async.js";
import { MyErrorHandler } from "./error.js";
import { authService } from "../services/auth.service.js";
import { userService } from "../services/user.service.js";
import type { VerifyAuthTokenBody } from "../types/type/customAuthTypes.js";
import type { UserRoleEnum } from "../generated/prisma/enums.js";


const authenticate = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction)=>{

    const token = req.headers?.authorization?.split(" ")[1];

    if(!token){
        throw new MyErrorHandler("Authentication Failed", 401);
    }


    try{
        
        authService.verifyAuthToken( token, async ( tokenPayload:VerifyAuthTokenBody)=>{

           
            if(!tokenPayload.error && tokenPayload.data?.email){

                // now add user in request 
                const user = await userService.getUserByEmail( tokenPayload.data?.email);

                if( user){

                    req.user = { 
                        id: user.id,
                        email: user.email,
                        roles: user.userRole as UserRoleEnum
                    }

                    next();
                }
                else{
                    return next( new MyErrorHandler("User does not Exist", 401));
                }
                
            }
            else{
                return next(new MyErrorHandler(`Authentication Failed: [${tokenPayload.err.message}]`, 401));
            }

        });

    }
    catch(err){
       throw new MyErrorHandler("i am custom error", 5000);
    }

})


export  { authenticate};