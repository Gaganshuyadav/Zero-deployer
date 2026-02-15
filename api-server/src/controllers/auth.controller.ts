import type { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import { userService } from "../services/user.service.js";
import { MyErrorHandler } from "../middleware/error.js";
import { authService } from "../services/auth.service.js";
import type { UserLoginBody } from "../types/req-body/user.js";

class AuthController{

    public login = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{

        const { email, password}:UserLoginBody = req.body;

        //find User
        const findUser = await userService.verifyUserExist(email);
        if(!findUser){
            throw new MyErrorHandler("User Not Exist", 400);
        }

        //check password
        const isPasswordCorrect = await userService.compareHashedPassword( password, findUser.password);

        if(isPasswordCorrect===false){
            throw new MyErrorHandler("Email or Password are Incorrect", 400);
        }

        const generateToken  = await authService.generateAuthToken( { email});

        const user = await userService.getUserById( findUser.id);

        return res.status(200).json({ 
            error: false,
            user: user,
            token: generateToken
        })

    }) 

    public logout = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        return res.status(200).json({ error: false})

    })
    
    public RefreshAuth = catchAsyncErrors( async( req:Request, res:Response, next:NextFunction)=>{

        // Now find user
        const user = await userService.getUserById(req?.user?.id as string);

        return res.status(200).json({
            error: false,
            user: user
        })
    })
}

const authController = new AuthController();

export { authController};