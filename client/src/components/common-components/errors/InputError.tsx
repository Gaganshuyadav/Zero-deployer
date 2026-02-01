
const InputError = ( {error}:{error?:string})=>{
    return(
        <div className=" text-red-500 text-xs mt-[-7px] mb-0 ml-2 mr-2">
            <div>{error}</div>
        </div>
    )
}

export { InputError};