import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";

class UserController{

    public createNewUser = catchAsyncErrors( async ( req:Request, res:Response, next:NextFunction):Promise<Response|void> =>{
        return res.json({ error: false})

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