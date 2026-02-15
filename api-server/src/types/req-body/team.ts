import type { ProjectType } from "../../generated/prisma/enums.js"

export type CreateNewTeamBody = {
    name: string,
    type: ProjectType
}




