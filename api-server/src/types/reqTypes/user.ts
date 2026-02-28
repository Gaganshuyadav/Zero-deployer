import z from "zod";
import type { allValidators } from "../../validators/all-validators.js";




export type CreateNewUserReqBody = 
  z.infer< typeof allValidators.authRegister>["body"]
  