import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { allValidators } from "../validators/all-validators.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post(
    "/login", 
    validate( allValidators.authlogin), 
    authController.login
);

router.post(
    "/logout", 
    validate( allValidators.authRegister),
    authenticate,
    authController.logout
);

router.get(
    "/authenticate-token",
    authenticate,
    authController.RefreshAuth

)

export default router;



