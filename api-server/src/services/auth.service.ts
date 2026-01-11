import jwt from "jsonwebtoken";

class AuthService{

    public generateAuthToken = async ( tokenBody:any):Promise<any> =>{

        if( !tokenBody) throw new Error("");

        // const token = await jwt.sign( tokenBody)


    }
}

const authService = new AuthService();

export { authService};