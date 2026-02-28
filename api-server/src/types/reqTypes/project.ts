import z from "zod";
import type { allValidators } from "../../validators/all-validators.js";


export type CreateNewProjectReqBody = 
  z.infer< typeof allValidators.createNewProject>["body"]
