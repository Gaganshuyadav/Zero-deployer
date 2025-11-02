const { exec} = require("child_process");
const path = require("path");
const fs = require("fs");
const { ensureEnv } = require("./core/utils/envChecker");
const { getAllFilesPathFromFolder } = require("./core/custom_funcs/getAllFilesPath");
const { uploadAllFilesToS3 } = require("./core/custom_funcs/uploadAllBuildFilesToS3");

BuiidRepo = ()=>{
    // console.log("I Am Ironman");
    // console.log(process.env.GITHUB_REPOSITORY_URL);
    // console.log(process.env.REPO_ID);
    // console.log("end");

    // const folderPathForRepoClone = path.join(__dirname,`./cloned-repo/123`); 

    // const allFilesPathsFromBuild = getAllFilesPathFromFolder(folderPathForRepoClone, false);
    // uploadAllFilesToS3( allFilesPathsFromBuild, 123, false);

    // return;

    ensureEnv(["GITHUB_REPOSITORY_URL","REPO_ID","AWS_ACCESS_KEY","AWS_SECRET_KEY","AWS_REGION","AWS_BUCKET"]);

    const github_repository_url = process.env.GITHUB_REPOSITORY_URL || "https://github.com/dumindapriyasad/todo-app.git";
    const repo_id = process.env.REPO_ID || `${(Math.floor(Math.random()*10000))}`;

    const folderPathForRepoClone = path.join(__dirname,`./cloned-repo/${repo_id}`); 
    const repoName = github_repository_url.split("/")[github_repository_url.split("/").length-1].toString().split(".")[0];

    const clone = exec(`git clone ${github_repository_url} ${folderPathForRepoClone}`);

    console.log("cloning.....");

    clone.on("close", async ()=>{

        // make path to check if it contains build command or not
        const targetPath = path.join(__dirname, `./cloned-repo/${repo_id}/`);

        const pkgPath = path.join(targetPath,"package.json");

        // if path exist for build Script
        if(fs.existsSync(pkgPath)){

            const pkg = JSON.parse(fs.readFileSync(pkgPath,"utf-8"));

            const hasBuildScript = pkg.scripts && pkg.scripts.build;

            if(hasBuildScript){
                console.log("contains build script");

                const buildRepo = exec(`echo "[INSTALL]" && npm install --prefix ${targetPath} && echo "[BUILD]" && npm run build --prefix ${targetPath}`);
                buildRepo.on("close",async ()=>{

                    console.log("build successful");

                    console.log("Starting Upload Files to S3...");
                    const allFilesPathsFromBuildFolder = getAllFilesPathFromFolder( `${targetPath}build`, true);
                    await uploadAllFilesToS3( allFilesPathsFromBuildFolder, repo_id, true);
                    console.log("All Build Files Uploaded Successfully");

                })

            }
            else{
                console.log("contains package.json but missing `build` script");
                return new Error("contains package.json but missing `build` script");
            }
        }
        //simple html,css,js files
        else{
                console.log("Starting Upload Files to S3...");
                const allFilesPathsFromFolder = getAllFilesPathFromFolder( `${targetPath}`, false);
                await uploadAllFilesToS3( allFilesPathsFromFolder, repo_id, false);
                console.log("All Files Uploaded Successfully");
        }

    })


    
    

    

}

BuiidRepo();