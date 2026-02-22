import type { Project } from "../../generated/prisma/client.js"

export type CreateNewProjectBody = Omit< Project , "id" | "createdAt" | "updatedAt">
