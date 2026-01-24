import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import type { User } from "../generated/prisma/client.js";
import { authService } from "../services/auth.service.js";
import { userService } from "../services/user.service.js";

class UserController{

    public createNewUser = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        
        const userBody:User = req.body;

        const { email, password} = userBody;

        const generateToken  = await authService.generateAuthToken( { email, password });

        const newUser = await userService.createUser(userBody);
        
        return res.json({
            error: false, 
            token: generateToken,
            user: newUser
        })

        return res.json({
            error: false
        })

    })

    public getUser = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        return res.json({ error: false})

    }) 

    public getAllUsers = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        return res.json({ error: false})
    })
}

const userController = new UserController();

export { userController};