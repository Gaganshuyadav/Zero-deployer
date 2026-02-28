import { Router} from "express";
import { validate } from "../middleware/validate.js";
import { allValidators } from "../validators/all-validators.js";
import { authenticate } from "../middleware/auth.js";
import { deploymentController } from "../controllers/deployment.controller.js";

const router = Router();

router.post(
    "/create", 
    authenticate,
    validate( allValidators.createNewDeployment),
    deploymentController.startNewDeployment
);

router.get(
    "/deploymentDetails/:id", 
    authenticate,
    validate( allValidators.getDeploymentById),
    deploymentController.getDeploymentDetails
);

router.post(
    "/", 
    authenticate,
    validate( allValidators.getAllDeployments),
    deploymentController.getAllDeployments
);

export default router;

