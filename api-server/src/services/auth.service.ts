import jwt from "jsonwebtoken";
import { strictEnvs } from "../config/envConfig.js";

class AuthService{

    public generateAuthToken = async ( tokenBody:any):Promise<any> =>{

        if( !tokenBody) throw new Error("");

        const token = jwt.sign( tokenBody, strictEnvs.JWT_SECRET, { expiresIn: strictEnvs.JWT_EXPIRES_IN} );

        return token;

    }


}

const authService = new AuthService();

export { authService};