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

router.get(
    "/projectDetails/:id", 
    authenticate,
    validate( allValidators.getProjectById),
    projectController.getProjectDetails
);

router.post(
    "/", 
    authenticate,
    validate( allValidators.getAllProject),
    projectController.getAllProjects
);

export default router;

