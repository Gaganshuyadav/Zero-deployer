import { Prisma } from "../../generated/prisma/client.js";

type GetUserByEmail = Prisma.UserGetPayload<{
    select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        userRole: true;
        createdAt: true;
        updatedAt: true;
    }
}>

export type { GetUserByEmail};