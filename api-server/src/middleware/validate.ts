import type { NextFunction, Request, Response } from "express";
import * as z from "zod";


type RequestSchemaShape = {
  body?: any;
  query?: any;
  params?: any;
};

export const validate = 
    ( schema: z.ZodType<RequestSchemaShape>) => {
        return ( req:Request, res:Response, next:NextFunction) => {
            
            try{
                const parsed = schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params
                })


                // overwrite with validated data, (body is writable, but query and params not writable in express new versions, now i am using Object.assign for this)

                if (parsed.body) {
                    req.body = parsed.body;
                }
                if (parsed.query && typeof parsed.query === "object") {
                  Object.assign(req.query, parsed.query);
                }
                if (parsed.params && typeof parsed.params === "object") {
                  Object.assign(req.params, parsed.params);
                }

                next();

            }
            catch(err){

                console.log(err)
                if( err instanceof z.ZodError){
                    return res.status(400).json({
                        error: true,
                        message: `Validation failed on path [${req.originalUrl}]`,
                        errors: JSON.parse(err.message)?.map((err:any)=>{
                            return `${err.path[err.path.length-1]} -- ${err.message} -- [${err.code}]`;
                        })
                    })
                }

                next(err);

            }

        };
    }


