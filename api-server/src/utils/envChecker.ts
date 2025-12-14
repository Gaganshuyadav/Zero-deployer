import type { Value } from "@prisma/client/runtime/library";


export const ensureEnv  = ( required:Record<any, any>, message:string="Missing environment variables: ")=>{

    const require:Array<string> = Object.values(required);

    const missing = require.filter(envName=>( !process.env[envName] || process.env[envName].trim()===""));
    if(missing.length){
        const msg = `${message}${missing.join(", ")}`;
        console.error(msg);
        throw new Error(msg);
    }
}

