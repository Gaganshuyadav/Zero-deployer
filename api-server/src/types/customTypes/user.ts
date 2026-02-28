import type { UserRoleEnum } from "../../generated/prisma/enums.js"


export type RequestUser = {
    id: string
    email: string
    roles: UserRoleEnum
} 