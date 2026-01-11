import type { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";

class AuthController{

    public login = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        return res.json({ error: false})

    }) 

    public logout = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        return res.json({ error: false})

    })
}

const authController = new AuthController();

export { authController};