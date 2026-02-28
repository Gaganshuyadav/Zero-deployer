import z from "zod";
import type { allValidators } from "../../validators/all-validators.js";




export type CreateNewDeploymentReqBody = 
  z.infer< typeof allValidators.createNewDeployment>["body"]