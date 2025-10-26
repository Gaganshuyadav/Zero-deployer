const { exec} = require("child_process");
const path = require("path");
const fs = require("fs");

BuiidRepo = ()=>{
    // console.log("I Am Ironman");
    // console.log(process.env.GITHUB_REPOSITORY_URL);
    // console.log(process.env.REPO_ID);
    // console.log("end");

    const github_repository_url = process.env.GITHUB_REPOSITORY_URL || "https://github.com/dumindapriyasad/todo-app.git";
    const repo_id = process.env.REPO_ID || `${(Math.floor(Math.random()*1000))}`;

    if(!(github_repository_url)){
        console.log("GITHUB_REPOSITORY_URL not provided");
        return new Error("GITHUB_REPOSITORY_URL not provided")
    }

    if(!(repo_id)){
        console.log("REPO_ID not provided");
        return new Error("REPO_ID not provided")
    }

    const folderPathForRepoClone = path.join(__dirname,`./cloned-repo/${repo_id}`); 
    const repoName = github_repository_url.split("/")[github_repository_url.split("/").length-1].toString().split(".")[0];

    const clone = exec(`git clone ${github_repository_url} ${folderPathForRepoClone}`);

    console.log("cloning.....");

    clone.on("close", ()=>{

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
                buildRepo.on("close",()=>{
                    console.log("build successful");
                })

            }
            else{
                console.log("contains package.json but missing `build` script");
                return new Error("contains package.json but missing `build` script");
            }
        }
        //simple html,css,js files
        else{

        }

    })


    
    

    

}

BuiidRepo();