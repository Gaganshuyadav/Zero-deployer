
interface ClickHouseLogEvent{
    user_id: string
    project_id: string | null
    deployment_id: string | null 
    log_level: LogLevelEnum
    message: string | null
    source: SourceEnum
    container_id: string | null
    host: string
    event_time?: string // ISO 8601
    event_id?: string,
    lastEventId: number // for SSE
}


type LogLevelEnum = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL"

type SourceEnum = "CONTAINER" | "BUILD" | "RUNTIME" | "SYSTEM";


type KafkaMessageRawLogEvent = ClickHouseLogEvent & {
    kafka_partition: number,
    kafka_offset: string
}

type findAllLogsQuerySchema = {
    userId:string, 
    projectId:string, 
    deploymentId:string, 
    page?:number, 
    limit?:number, 
    orderBy?:string
}


export type { ClickHouseLogEvent, KafkaMessageRawLogEvent, LogLevelEnum, SourceEnum, findAllLogsQuerySchema};