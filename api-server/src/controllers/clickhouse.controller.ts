import { error } from "console";
import catchAsyncErrors from "../middleware/catch-async.js";
import { clickHouseService } from "../services/clickhouse.service.js";
import type { ClickHouseLogEvent, findAllLogsQuerySchema, KafkaMessageRawLogEvent } from "../types/interfaces/clickhouse_log_event_schema.js";
import type { Request, Response, NextFunction } from "express";

class ClickHouseController{

    public insertBulkRows = catchAsyncErrors( async ( req:Request, res:Response):Promise<Response|void> =>{

        const chunk = req.body.rowsData as Array<ClickHouseLogEvent>;
        await clickHouseService.insertChunkIntoClickhouse( chunk);

        return res.json({
            error: false,
            message: "Log Row Inserted Successfully"
        })

    });

    public findAllLogs = catchAsyncErrors( async ( req:Request, res:Response):Promise<Response|void> =>{
        

        const queryData = req.body as findAllLogsQuerySchema;
        const logsData = await clickHouseService.getAllLogs( queryData);

        return res.json({
            error: false,
            message: "All Logs Fetched Successfully",
            data: logsData

        })

    });

    public createNewTableInClickhouse = catchAsyncErrors( async( req:Request, res: Response):Promise<Response|void>=>{

        const resData = await clickHouseService.createNewTable();

        return res.json({
            error: false,
            message: "New Table Created Successfully"

        })
    })


}

const clickhouseController = new ClickHouseController();

export { clickhouseController};
