import type { NextFunction, Response, Request } from "express";
import catchAsyncErrors from "../middleware/catch-async.js";
import { prisma } from "../DB/prisma-client/PrismaClient.js";
import type { User } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";
import { tr } from "zod/locales";
import type { GetUserByEmail } from "../types/prismaTypes/user.js";

class UserService{

    public createUser = async ( body:User):Promise<any> =>{

        // convert password into hashed password
        const hashedPassword = await this.convertPasswordIntoHashedPassword( body.password);
        
        const newUser = await prisma.user.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: hashedPassword
            }
        })

        console.log("::::: ", newUser);

        return newUser;
    }

    public verifyUserExist = async( email:string):Promise<User|null>=>{

        //check if user already exist
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        return user;
    }

    public compareHashedPassword = async ( givenPassword:string, existedPassword:string) =>{

        const checkResult = await bcrypt.compare( givenPassword, existedPassword);
    
        return checkResult;
    }

    public convertPasswordIntoHashedPassword = async ( password:string):Promise<string> =>{

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash( password, salt);

        return hashedPassword;

    }

    public getUserByEmail = async ( email:string):Promise<User|null> =>{

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        return user;
    } 

    public getUserById = async ( id:string):Promise< GetUserByEmail|null> =>{

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                userRole: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return user;
    }

}

const userService = new UserService();

export { userService};