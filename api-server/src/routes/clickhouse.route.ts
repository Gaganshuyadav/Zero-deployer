import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { allValidators } from "../validators/all-validators.js";
import { authenticate } from "../middleware/auth.js";
import { clickhouseController } from "../controllers/clickhouse.controller.js";

const router = Router();

router.post(
    "/insert-bulk-rows", 
    authenticate,
    validate(allValidators.insertBulkLogRows),
    clickhouseController.insertBulkRows
    
);

router.post(
    "/find-logs", 
    authenticate,
    validate( allValidators.findALLLogs),
    clickhouseController.findAllLogs
);

router.post(
    "/create-new-table-with-new-mask-same-task",
    authenticate,
    clickhouseController.createNewTableInClickhouse

)

export default router;



