import { Router} from "express";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.post(
    "/create", 
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

