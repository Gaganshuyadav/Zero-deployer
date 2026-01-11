import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import { prisma } from "../DB/prisma-client/PrismaClient.js";
import type { User } from "../generated/prisma/client.js";

class UserService{

    public createUser = async ( body:User):Promise<any> =>{
        
        const newUser = await prisma.user.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: body.password
            }
        })

        return newUser;
    }

    public getUser = async ( id:string):Promise<any> =>{

        // 
    } 

    public getAllUsers = async ( ):Promise<any> =>{
        return
    }
}

const userService = new UserService();

export { userService};