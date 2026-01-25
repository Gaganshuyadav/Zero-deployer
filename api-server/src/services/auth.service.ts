import jwt from "jsonwebtoken";
import { strictEnvs } from "../config/envConfig.js";
import { error } from "console";
import type { VerifyAuthTokenBody } from "../types/type/customAuthTypes.js";

class AuthService{

    public generateAuthToken = async ( tokenBody:any):Promise<any> =>{

        if( !tokenBody) throw new Error("Token Body not provided");

        const token = jwt.sign( tokenBody, strictEnvs.JWT_SECRET, { expiresIn: strictEnvs.JWT_EXPIRES_IN} );

        return token;

    }

    public verifyAuthToken = async ( token:string, callback:Function) =>{

        try{
            const verifyToken = jwt.verify( token, strictEnvs.JWT_SECRET);
            callback({ error: false, data: verifyToken, errString:null});
        }
        catch(err){
            callback({ error: true, data: null, err: err});
        }
        

    } 


}

const authService = new AuthService();

export { authService};