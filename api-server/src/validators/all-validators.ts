import * as z from "zod";
import { ProjectType } from "../generated/prisma/enums.js";

class AllValidators{

    public authlogin = z.object({
      body: z.object({
        email: z.string({
          error: "Email is required"
        })
        .min(1, "Email is not provided")
        .email("Invalid email address"),
    
        password: z.string({
          error: "Password is required"
        })
        .min(4, "Password should not be empty")
      })
    })
    
    
    public authRegister = z.object({
      body: z.object({
        firstName: z.string({
          error: "First name is required"
        })
        .min(2, "First name must be at least 2 characters"),
    
        lastName: z.string({
          error: "Last name must be a string"
        }).optional(),
    
        email: z.string({
          error: "Email is required"
        })
        .email("Invalid email address"),
    
        password: z.string({
          error: "Password is required"
        })
        .min(4, "Password must be at least 4 characters")
      })
    })
    
    
    public newTeamCreate = z.object({
      body: z.object({
        name: z.string({
          error: "Team name is required"
        })
        .min(1, "Team name is required"),
    
        type: z.enum(
          Object.values(ProjectType) as [string, ...string[]],
          { message: "Invalid project type" }
        )
      })
    })
    
    
    public getTeamById = z.object({
      params: z.object({
        id: z.string({
          error: "Team ID is required"
        })
        .min(1, "Team ID is required")
      })
    })
    
    
    public createNewProject = z.object({
      body: z.object({
        name: z.string({
          error: "Project name is required"
        })
        .min(1, "Project name is required"),
    
        team_id: z.string({
          error: "Provide Team Id"
        })
        .min(1, "Team Id is required"),
    
        gitUrl: z.string({
          error: "Git URL is required"
        })
        .min(2, "Git URL must contain at least 2 characters"),
    
        subDomain: z.string({
          error: "Subdomain is required"
        })
        .min(1, "Subdomain is required"),
    
        customDomain: z.string({
          error: "Custom domain is required"
        })
        .min(1, "Custom domain is required")
      })
    })

}

const allValidators = new AllValidators();
export { allValidators};