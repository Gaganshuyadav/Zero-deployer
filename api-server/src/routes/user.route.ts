import { Router} from "express";
import { userController } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import { allValidators } from "../validators/all-validators.js";

const router = Router();

router.post(
    "/create", 
    validate( allValidators.authRegister),
    userController.createNewUser
);

router.get(
    "/:id", 
    userController.getUser
);

router.get(
    "/users", 
    userController.getAllUsers
);

export default router;

