import type { Deployment } from "../../generated/prisma/client.js"


export type CreateNewDeploymentBody = Omit< Deployment , "id" | "createdAt" | "updatedAt">


