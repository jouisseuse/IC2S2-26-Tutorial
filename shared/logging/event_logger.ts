export type ActorType = "human" | "llm" | "scripted" | "random";

export interface EventLogRecord {
  event_id: string;
  event_type: string;
  game_id: string;
  group_id: string;
  round: number | null;
  stage: string | null;
  actor_id: string | null;
  actor_type: ActorType | null;
  treatment: string | null;
  action?: Record<string, unknown> | null;
  observation?: Record<string, unknown> | null;
  payoff?: number | null;
  details?: Record<string, unknown> | null;
  timestamp: string;
}

export interface EventLogger {
  records: EventLogRecord[];
  log(record: Omit<EventLogRecord, "event_id" | "timestamp"> & Partial<Pick<EventLogRecord, "event_id" | "timestamp">>): EventLogRecord;
  filter(eventType: string): EventLogRecord[];
  clear(): void;
}

export function createEventLogger(prefix = "event"): EventLogger {
  const records: EventLogRecord[] = [];
  return {
    records,
    log(record) {
      const fullRecord: EventLogRecord = {
        event_id: record.event_id || `${prefix}_${records.length + 1}`,
        timestamp: record.timestamp || new Date().toISOString(),
        action: null,
        observation: null,
        payoff: null,
        details: null,
        ...record,
      };
      records.push(fullRecord);
      return fullRecord;
    },
    filter(eventType) {
      return records.filter((record) => record.event_type === eventType);
    },
    clear() {
      records.length = 0;
    },
  };
}

export function createEventRecord(
  event_type: string,
  fields: Omit<EventLogRecord, "event_id" | "event_type" | "timestamp"> &
    Partial<Pick<EventLogRecord, "event_id" | "timestamp">>
): EventLogRecord {
  return {
    event_id: fields.event_id || `${event_type}_${Date.now()}`,
    event_type,
    timestamp: fields.timestamp || new Date().toISOString(),
    ...fields,
  };
}

