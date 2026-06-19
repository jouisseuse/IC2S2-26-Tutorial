export interface SharedActionRecord {
  action_id: string;
  actor_id: string;
  actor_type: "human" | "llm" | "scripted" | "random";
  game_id: string;
  group_id: string;
  round: number;
  stage: string;
  action_type: string;
  action_value: unknown;
  is_valid: boolean;
  validation_error: string | null;
  treatment: string | null;
  timestamp: string;
  [key: string]: unknown;
}

export function mergeActions(records: SharedActionRecord[]): SharedActionRecord[] {
  return [...records].sort((a, b) => {
    if (a.round !== b.round) return a.round - b.round;
    return a.timestamp.localeCompare(b.timestamp);
  });
}

export function groupActionsByRound(records: SharedActionRecord[]) {
  return records.reduce<Record<string, SharedActionRecord[]>>((groups, record) => {
    const key = `${record.game_id}:${record.group_id}:${record.round}`;
    groups[key] ||= [];
    groups[key].push(record);
    return groups;
  }, {});
}
