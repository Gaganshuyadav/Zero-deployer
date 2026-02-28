import z from "zod";
import type { allValidators } from "../../validators/all-validators.js";




export type CreateNewTeamReqBody = 
  z.infer< typeof allValidators.newTeamCreate>["body"]



