export interface HumanActionInput {
  actorId: string;
  gameId: string;
  groupId: string;
  round: number;
  stage: string;
  actionType: string;
  actionValue: unknown;
  treatment?: string | null;
  timestamp?: string;
}

export function collectHumanAction(input: HumanActionInput) {
  return {
    action_id: `human_${input.actorId}_${input.round}_${Date.now()}`,
    actor_id: input.actorId,
    actor_type: "human" as const,
    game_id: input.gameId,
    group_id: input.groupId,
    round: input.round,
    stage: input.stage,
    action_type: input.actionType,
    action_value: input.actionValue,
    is_valid: true,
    validation_error: null,
    treatment: input.treatment ?? null,
    timestamp: input.timestamp || new Date().toISOString(),
  };
}
