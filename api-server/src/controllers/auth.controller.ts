import type { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import { userService } from "../services/user.service.js";

class AuthController{

    public login = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{

        const user = await userService.getUserById( req.user?.id as string);

        return res.json({ 
            error: false,
            user: user
        })

    }) 

    public logout = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        return res.json({ error: false})

    })
}

const authController = new AuthController();

export { authController};