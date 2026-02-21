import { Router} from "express";
import { validate } from "../middleware/validate.js";
import { allValidators } from "../validators/all-validators.js";
import { teamController } from "../controllers/team.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post(
    "/create", 
    authenticate,
    validate( allValidators.newTeamCreate),
    teamController.createNewTeam
);

router.get(
    "/:id", 
    authenticate,
    validate( allValidators.getTeamById),
    teamController.getTeam
);

router.get(
    "/", 
    authenticate,
    teamController.getAllTeams
);

export default router;

