// GITHUB_REPOSITORY="https://github.com/Gaganshuyadav/template-for-simple-node-server-ts.git"
// REPO_ID="1234"



BuiidRepo = ()=>{
    // console.log("I Am Ironman");
    // console.log(process.env.GITHUB_REPOSITORY_URL);
    // console.log(process.env.REPO_ID);
    // console.log("end");

    const github_repository_url = process.env.GITHUB_REPOSITORY_URL;
    const repo_id = process.env.REPO_ID;

    if(!(github_repository_url)){
        console.log("GITHUB_REPOSITORY_URL not provided");
        return new Error("GITHUB_REPOSITORY_URL not provided")
    }

    if(!(repo_id)){
        console.log("REPO_ID not provided");
        return new Error("REPO_ID not provided")
    }

    const clone = exec(`git clone ${github_repository_url}`);

    console.log("cloning.....");


    
    

    

}

BuiidRepo();