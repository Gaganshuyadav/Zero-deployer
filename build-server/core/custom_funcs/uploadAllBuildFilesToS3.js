const path = require("path");
const { uploadFileToS3 } = require("../services/aws/S3_BucketService");

const uploadAllFilesToS3 = async ( allFilesPaths=[], repoId, isBuild=false)=>{

    const allS3Res = [];
    console.log(allFilesPaths)
    allFilesPaths.forEach(filePath => {
        //remove build between repoId and main path , and also add correct path for S3 bucket 
        let fileNameKeyForS3;
        if(isBuild){
            fileNameKeyForS3 = `all-proj-builds/${repoId}${filePath.replace(/\\/g,"/").split(`${repoId}/build`)[1]}`;
        }
        else{
            fileNameKeyForS3 = `all-proj-builds/${repoId}${filePath.replace(/\\/g,"/").split(`${repoId}`)[1]}`;
        }
        
        allS3Res.push( uploadFileToS3( fileNameKeyForS3, filePath));
    });

    //resolve all promise or upload all files
    let resolve_All_S3_Response;
    try{
        resolve_All_S3_Response = await Promise.all(allS3Res);
    }
    catch(err){
        console.log("----------------------------");
        console.log("error comes :------------- ");
        console.log(err);
        console.log("*****")
    }

    console.log("Resolved S3 Response:- ",resolve_All_S3_Response);
    return resolve_All_S3_Response;
}

module.exports = { uploadAllFilesToS3};