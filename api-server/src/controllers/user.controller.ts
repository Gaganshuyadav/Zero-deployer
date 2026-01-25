import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import type { User } from "../generated/prisma/client.js";
import { authService } from "../services/auth.service.js";
import { userService } from "../services/user.service.js";
import { MyErrorHandler } from "../middleware/error.js";

class UserController{

    public createNewUser = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        
        const userBody:User = req.body;

        const { email, password} = userBody;

        // check if user exist already
        const user = await userService.verifyUserExist(email);

        if(user){
            throw new MyErrorHandler("User Already Exist", 400);
        }

        const generateToken  = await authService.generateAuthToken( { email});

        const newUser = await userService.createUser(userBody);
        
        return res.json({
            error: false, 
            token: generateToken,
            user: newUser
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