
const ensureEnv  = ( required=[], message="Missing environment variables: ")=>{

    const missing = required.filter(envName=>( !process.env[envName] || process.env[envName].trim()===""));
    if(missing.length){
        const msg = `${message}${missing.join(", ")}`;
        console.error(msg);
        throw new Error(msg);
    }
}

module.exports = { ensureEnv};