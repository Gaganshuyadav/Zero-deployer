
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
    event_id?: string
}


type LogLevelEnum = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL"

type SourceEnum = "CONTAINER" | "BUILD" | "RUNTIME" | "SYSTEM";

export type { ClickHouseLogEvent};