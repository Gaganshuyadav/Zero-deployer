import type { NextFunction, Response, Request } from "express";


//error middleware

const errorMiddleware = ( err:MyErrorHandler|Error, req:Request, res:Response, next:NextFunction) =>{

    let message, statusCode=500;
    if( err instanceof MyErrorHandler){
        // This is an expression, not a block
        ({ message="Internal Server Error", statusCode} = err);
    }
    else{
        ({ message="Internal Server Error"} = err);
    }

    return res.status(statusCode).json({
        error: true,
        message: message
    })
}

class MyErrorHandler extends Error{

    public statusCode:number;

    constructor( message:string, statusCode: number){

        super();
        this.message = message;
        this.statusCode = statusCode;

        // Object.setPrototypeOf(this, new.target.prototype);

    }
}




export { errorMiddleware, MyErrorHandler};
