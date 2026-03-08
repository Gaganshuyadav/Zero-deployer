const dotenv = require("dotenv");
dotenv.config();
const { exec} = require("child_process");
const path = require("path");
const fs = require("fs");
const { initConfig_with_envChecking } = require("./core/utils/envChecker");
const { getAllFilesPathFromFolder } = require("./core/custom_funcs/getAllFilesPath");
const { uploadAllFilesToS3 } = require("./core/custom_funcs/uploadAllBuildFilesToS3");
const { produceLogs } = require("./core/services/kafka/Kafka_Log_Service");


const BuiidRepo = async ()=>{

    process.env.GITHUB_REPOSITORY_URL = "https://github.com/dumindapriyasad/todo-app.git"
    process.env.REPO_ID = "first-Project-7-41123"
    process.env.SERVER_USER_ID = "7bd5b3a3-b770-425b-b48d-32aa3ca54ff6"
    process.env.SERVER_PROJECT_ID = "1962798d-dbe9-41bc-a78b-418a89e81ffb"
    process.env.SERVER_DEPLOYMENT_ID = "338db8ce-08b0-40fc-a116-028b7d9e80bc"


    await initConfig_with_envChecking();   

    // const github_repository_url = process.env.GITHUB_REPOSITORY_URL || "https://github.com/dumindapriyasad/todo-app.git" || "https://github.com/prashantbuilds/macbook-air-m2-landing-page.git";
    const github_repository_url = process.env.GITHUB_REPOSITORY_URL;
    const repo_id = process.env.REPO_ID || `${(Math.floor(Math.random()*10000))}`;

    const folderPathForRepoClone = path.join(__dirname,`./cloned-repo/${repo_id}`); 
    const repoName = github_repository_url.split("/")[github_repository_url.split("/").length-1].toString().split(".")[0];

    const clone = exec(`git clone ${github_repository_url} ${folderPathForRepoClone}`);

    await produceLogs("cloning.....","INFO");

    clone.on("close", async ()=>{

        // make path to check if it contains build command or not
        const targetPath = path.join(__dirname, `./cloned-repo/${repo_id}/`);

        const pkgPath = path.join(targetPath,"package.json");

        // if path exist for build Script
        if(fs.existsSync(pkgPath)){

            const pkg = JSON.parse(fs.readFileSync(pkgPath,"utf-8"));

            const hasBuildScript = pkg.scripts && pkg.scripts.build;

            if(hasBuildScript){
                await produceLogs("contains build script","INFO");

                await produceLogs("npm install ...","INFO");
                const node_modules_install = exec(`npm install --prefix ${targetPath}`);

                node_modules_install.stdout.on("data", async ( data)=>{
                    await produceLogs(data,"INFO");
                })

                node_modules_install.on("close",async ()=>{

                    await produceLogs("Build start... ","INFO");

                    // change homepage path , to serve builds
                    pkg.homepage = "./";
                    fs.writeFileSync( pkgPath, JSON.stringify(pkg,null,2)+"\n");


                    const makeBuild = exec(`npm run build --prefix ${targetPath}`);

                    makeBuild.stdout.on("data", async ( data)=>{
                        await produceLogs( data, "INFO");
                    })

                    makeBuild.on("close", async ()=>{

                        await produceLogs("build successful","INFO");

                        await produceLogs("Starting Upload Files to S3...","INFO");
                        const allFilesPathsFromBuildFolder = getAllFilesPathFromFolder( `${targetPath}build`, true);
                        await uploadAllFilesToS3( allFilesPathsFromBuildFolder, repo_id, true);
                        await produceLogs("All Build Files Uploaded Successfully","INFO");
                        await produceLogs("Destroy Container","INFO");
                        process.exit(0);
                    })

                })

            }
            else{
                await produceLogs("contains package.json but missing `build` script","ERROR");
                return new Error("contains package.json but missing `build` script");
            }
        }
        //simple html,css,js files
        else{
                await produceLogs("Starting Upload Files to S3...","INFO");
                const allFilesPathsFromFolder = getAllFilesPathFromFolder( `${targetPath}`, false);
                await uploadAllFilesToS3( allFilesPathsFromFolder, repo_id, false);
                await produceLogs("All Files Uploaded Successfully","INFO");
                
                await produceLogs("Destroy Container","INFO");
                process.exit(0);
        }

    })


    
    

    

}

 BuiidRepo();

module.exports = { BuiidRepo};