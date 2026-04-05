import { error } from "console";
import catchAsyncErrors from "../middleware/catch-async.js";
import { clickHouseService } from "../services/clickhouse.service.js";
import type { ClickHouseLogEvent, findAllLogsQuerySchema, KafkaMessageRawLogEvent } from "../types/interfaces/clickhouse_log_event_schema.js";
import type { Request, Response, NextFunction } from "express";

class ClickHouseController{

    public insertBulkRows = catchAsyncErrors( async ( req:Request, res:Response):Promise<Response|void> =>{

        const chunk = req.body.rowsData as Array<ClickHouseLogEvent>;
        await clickHouseService.insertChunkIntoClickhouse( chunk);



    //     [{
    //     user_id: "550e8400-e29b-41d4-a716-446655460001",
    //     project_id: "550e8400-e29b-41d4-a716-446655460002",
    //     deployment_id: "550e8400-e29b-41d4-a716-446655460003",
    //     log_level: "INFO",
    //     message: "Service started successfully",
    //     source: "BUILD",
    //     container_id: "container_123",
    //     host: "ip-192-168-1-10",
    //     // event_time: "2026-03-28T10:15:30.123",
    //     event_time: (new Date().toISOString()).replace("Z",""),
    //     event_id: "550e8400-e29b-41d4-a716-446655440004"
    //     // kafka_partition: 2,
    //     // kafka_offset: "10567"
    //   }]

        return res.json({
            error: false,
            message: "Log Row Inserted Successfully"
        })

    });

    public findAllLogs = catchAsyncErrors( async ( req:Request, res:Response):Promise<Response|void> =>{


    //     {
    //   userId: "550e8400-e29b-41d4-a716-446655460001",
    //   projectId: "550e8400-e29b-41d4-a716-446655460002",
    //   deploymentId: "550e8400-e29b-41d4-a716-446655460003",
    //   page: 1,
    //   limit: 2
    // }

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
