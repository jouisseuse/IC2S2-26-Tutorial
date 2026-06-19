export interface LLMCallRecord {
  llm_call_id: string;
  actor_id: string;
  game_id?: string | null;
  group_id?: string | null;
  round?: number | null;
  stage?: string | null;
  model_provider: string;
  model_name: string;
  prompt_id: string;
  system_prompt: string;
  user_prompt: string;
  raw_response: string;
  parsed_action: Record<string, unknown> | null;
  latency_ms: number;
  temperature: number | null;
  max_tokens: number | null;
  error: string | null;
  timestamp: string;
}

export interface LLMCallLogger {
  records: LLMCallRecord[];
  log(record: Omit<LLMCallRecord, "llm_call_id" | "timestamp"> & Partial<Pick<LLMCallRecord, "llm_call_id" | "timestamp">>): LLMCallRecord;
  clear(): void;
}

export function createLLMCallLogger(prefix = "llm_call"): LLMCallLogger {
  const records: LLMCallRecord[] = [];
  return {
    records,
    log(record) {
      const fullRecord: LLMCallRecord = {
        llm_call_id: record.llm_call_id || `${prefix}_${records.length + 1}`,
        timestamp: record.timestamp || new Date().toISOString(),
        ...record,
      };
      records.push(fullRecord);
      return fullRecord;
    },
    clear() {
      records.length = 0;
    },
  };
}

