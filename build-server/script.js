// GITHUB_REPOSITORY="https://github.com/Gaganshuyadav/template-for-simple-node-server-ts.git"
// REPO_ID="1234"



BuiidRepo = ()=>{
    // console.log("I Am Ironman");
    // console.log(process.env.GITHUB_REPOSITORY_URL);
    // console.log(process.env.REPO_ID);
    // console.log("end");

    if(!(process.env.GITHUB_REPOSITORY_URL)){
        console.log("GITHUB_REPOSITORY_URL not provided");
        return new Error("GITHUB_REPOSITORY_URL not provided")
    }

    if(!(process.env.REPO_ID)){
        console.log("REPO_ID not provided");
        return new Error("REPO_ID not provided")
    }

    
    

    

}

BuiidRepo();