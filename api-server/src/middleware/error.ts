import type { NextFunction, Response, Request } from "express";


//error middleware

const errorMiddleware = ( err:MyErrorHandler|Error, req:Request, res:Response, next:NextFunction) =>{

    let message, statusCode;
    if( err instanceof MyErrorHandler){
        // This is an expression, not a block
        ({ message="Internal Server Error", statusCode=500} = err);
    }
    else{
        ({ message="Internal Server Error"} = err);
    }

    return res.json({
        error: false,
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
