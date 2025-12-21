const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const mime = require("mime-types");
const { produceLogs } = require("../kafka/Kafka_Log_Service");

const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
})


exports.uploadFileToS3 = async ( fileNameKey, filePath) =>{

    if(process.env.AWS_SQS_SERVICE_EXIST!=="1"){ (await produceLogs("S3 run in local")); return;}

    const fileContent = fs.readFileSync(filePath);

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET,
        Body: fileContent,
        Key: fileNameKey,
        ContentType: mime.lookup(filePath)
    }

    const fileUploadPromise = s3.send( new PutObjectCommand(uploadParams));

    return fileUploadPromise;


}