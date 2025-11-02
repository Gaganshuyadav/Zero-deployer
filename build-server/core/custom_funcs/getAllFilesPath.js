const fs = require("fs");

const getAllFilesPathFromFolder = ( folderPath, isBuild=false)=>{

    let allFilesPath = [];
    const allFilesAndFolderFromPath = fs.readdirSync(folderPath);

    allFilesAndFolderFromPath.forEach((file)=>{
        const fullFilePath = `${folderPath}/${file}`;

        //if it is not build folder then remove some files and folders
        if( !isBuild && [".git","README.md",".gitigonoe","Dockerfile"].includes(file)){
            return;
        }

        if( fs.statSync(fullFilePath).isDirectory()){
            allFilesPath = allFilesPath.concat(getAllFilesPathFromFolder( fullFilePath));
        }
        else{
            allFilesPath.push(fullFilePath);
        }
    })

    return allFilesPath;
}

module.exports = { getAllFilesPathFromFolder};