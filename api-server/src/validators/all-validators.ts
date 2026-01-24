import * as z from "zod";

class AllValidators{

    public authlogin = z.object({
        body: z.object({
            email: z.string().email().min(1, "Email is not provided"),
            password: z.string().min(1, "Password should not be empty")
        })
    })

    public authRegister = z.object({
        body: z.object({
            firstName: z.string().min(2),
            email: z.string().email(),
            password: z.string().min(8)
        })
    })

}

const allValidators = new AllValidators();
export { allValidators};