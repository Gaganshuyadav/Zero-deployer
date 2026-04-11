import { Router} from "express";
import { validate } from "../middleware/validate.js";
import { allValidators } from "../validators/all-validators.js";
import { authenticate } from "../middleware/auth.js";
import { projectController } from "../controllers/project.controller.js";
import { serverSideEvents } from "../controllers/sse.controller.js";

const router = Router();

router.get(
    "/deployment-logs-event-stream", 
    serverSideEvents.getRealTimeDeploymentLogs
);

router.get(
    "/connect",
    serverSideEvents.createLog
)

export default router;

