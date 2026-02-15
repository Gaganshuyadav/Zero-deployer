import * as z from "zod";
import { ProjectType } from "../generated/prisma/enums.js";

class AllValidators{

    public authlogin = z.object({
        body: z.object({
            email: z.string().email().min(1, "Email is not provided"),
            password: z.string().min(4, "Password should not be empty")
        })
    })

    public authRegister = z.object({
        body: z.object({
            firstName: z.string().min(2),
            lastName: z.string().optional(),
            email: z.string().email(),
            password: z.string().min(4)
        })
    })

    public newTeamCreate = z.object({
        body: z.object({
          name: z.string().min(1),
          type: ProjectType
        })
    })

}

const allValidators = new AllValidators();
export { allValidators};