import type { Value } from "@prisma/client/runtime/library";


export const ensureEnv  = ( required:Record<any, any>, message:string="Missing environment variables: ")=>{

    const require:Array<string> = Object.keys(required);

    const missing = require.filter((envName:any)=>{ 

        let value = required[envName];
        return (value===null || value===undefined || String(value)?.trim()==="")
    }
    );
        
    if(missing.length){
        const msg = `${message}${missing.join(", ")}`;
        console.error(msg);
        throw new Error(msg);
    }
}

