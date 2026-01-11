import catchAsyncErrors from "./catch-async.js";


const authenticate = catchAsyncErrors( async ( req:Request, res:Response)=>{

    console.log(req);
})