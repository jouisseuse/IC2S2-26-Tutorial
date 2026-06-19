export function playerRoundRecord(options: {
  gameId: string;
  groupId: string;
  round: number;
  stage: string;
  actorId: string;
  actorType?: string;
  actionType: string;
  actionValue: unknown;
  payoff?: number | null;
  treatment?: string | null;
  timestamp?: string;
}) {
  return {
    game_id: options.gameId,
    group_id: options.groupId,
    round: options.round,
    stage: options.stage,
    actor_id: options.actorId,
    actor_type: options.actorType || "human",
    action_type: options.actionType,
    action_value: options.actionValue,
    payoff: options.payoff ?? null,
    treatment: options.treatment ?? null,
    timestamp: options.timestamp || new Date().toISOString(),
  };
}

export function groupRoundRecord(records: Array<Record<string, unknown>>) {
  const first = records[0] || {};
  const numericActions = records
    .map((record) => Number(record.action_value))
    .filter((value) => Number.isFinite(value));
  const total = numericActions.reduce((sum, value) => sum + value, 0);
  return {
    game_id: first.game_id,
    group_id: first.group_id,
    round: first.round,
    n_players: records.length,
    total_action_value: total,
    average_action_value: numericActions.length ? total / numericActions.length : null,
  };
}
