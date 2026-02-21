import { Router} from "express";
import { validate } from "../middleware/validate.js";
import { allValidators } from "../validators/all-validators.js";
import { authenticate } from "../middleware/auth.js";
import { projectController } from "../controllers/project.controller.js";

const router = Router();

router.post(
    "/create", 
    authenticate,
    validate( allValidators.createNewProject),
    projectController.createNewProject
);

// router.get(
//     "/:id", 
//     authenticate,
//     validate( allValidators.getTeamById),
//     teamController.getTeam
// );

// router.get(
//     "/", 
//     authenticate,
//     teamController.getAllTeams
// );

export default router;

