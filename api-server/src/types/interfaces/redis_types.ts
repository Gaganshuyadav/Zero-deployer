import type { ClickHouseLogEvent, KafkaMessageRawLogEvent } from "./clickhouse_log_event_schema.js";

type PublisherLogPayload = {
    deployment_id: string
    lastEventId: number
    logData: string
}


type PublishEventPayload =
  | {
      multiple: true
      payload: PublisherLogPayload[]
    }
  | {
      multiple: false
      payload: PublisherLogPayload
    }

export type { PublishEventPayload, PublisherLogPayload};

