
type SqsDeployMessage= {
    repoId:string,
    githubUrl: string,
    user_id: string,
    project_id: string,
    deployment_id: string
}

export type { SqsDeployMessage};