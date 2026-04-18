

type LogLevelEnum = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL"

type SourceEnum = "CONTAINER" | "BUILD" | "RUNTIME" | "SYSTEM";



interface KafkaLogPayloadMessageBody{
    user_id: string
    project_id: string | null
    deployment_id: string | null 
    log_level: LogLevelEnum
    message: string | null
    source: SourceEnum
    container_id: string | null
    host: string
    created_at: Date
    lastEventId: number // for SSE
}

export type { KafkaLogPayloadMessageBody};