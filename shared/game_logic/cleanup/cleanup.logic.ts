import type { CleanupAction, CleanupConfig, CleanupRoundRecord, CleanupState } from "./cleanup.types";

export function createInitialState(config: CleanupConfig, actorIds?: string[]): CleanupState {
  const ids =
    actorIds && actorIds.length > 0
      ? actorIds
      : Array.from({ length: config.groupSize }, (_, index) => `player_${index + 1}`);
  return {
    gameId: config.gameId || "cleanup_game",
    groupId: config.groupId || "group_1",
    config: {
      gameId: config.gameId || "cleanup_game",
      groupId: config.groupId || "group_1",
      groupSize: config.groupSize,
      numRounds: config.numRounds,
      endowment: config.endowment,
      cleanupCost: config.cleanupCost,
      pollutionStart: config.pollutionStart,
      pollutionReductionPerEffort: config.pollutionReductionPerEffort,
      treatment: config.treatment || "control",
    },
    round: 1,
    actorIds: ids,
    pollution: config.pollutionStart,
    history: [],
    ended: false,
  };
}

export function getObservationForAgent(state: CleanupState, actorId: string) {
  if (!state.actorIds.includes(actorId)) {
    throw new Error(`Unknown actorId: ${actorId}`);
  }
  return {
    game_id: state.gameId,
    group_id: state.groupId,
    actor_id: actorId,
    round: state.round,
    endowment: state.config.endowment,
    cleanup_cost: state.config.cleanupCost,
    pollution: state.pollution,
    treatment: state.config.treatment,
  };
}

export function validateAction(state: CleanupState, action: CleanupAction) {
  if (state.ended) return { valid: false, reason: "game is already over" };
  if (!state.actorIds.includes(action.actorId)) return { valid: false, reason: "unknown actor" };
  if (!Number.isFinite(action.effort) || action.effort < 0) {
    return { valid: false, reason: "effort must be non-negative" };
  }
  if (action.effort * state.config.cleanupCost > state.config.endowment) {
    return { valid: false, reason: "effort cost exceeds endowment" };
  }
  return { valid: true };
}

export function applyActions(
  state: CleanupState,
  actions: CleanupAction[],
  timestamp = new Date().toISOString()
): CleanupState {
  for (const action of actions) {
    const result = validateAction(state, action);
    if (!result.valid) throw new Error(`Invalid action: ${result.reason}`);
  }

  const completedActions = state.actorIds.map((actorId) => {
    const action = actions.find((entry) => entry.actorId === actorId);
    return { actorId, effort: action?.effort ?? 0, round: state.round, timestamp };
  });
  const totalEffort = completedActions.reduce((sum, action) => sum + action.effort, 0);
  const pollutionAfter = Math.max(
    0,
    state.pollution - totalEffort * state.config.pollutionReductionPerEffort
  );
  const record: CleanupRoundRecord = {
    gameId: state.gameId,
    groupId: state.groupId,
    round: state.round,
    pollutionBefore: state.pollution,
    pollutionAfter,
    totalEffort,
    actions: completedActions,
    timestamp,
  };
  const nextRound = state.round + 1;
  return {
    ...state,
    pollution: pollutionAfter,
    round: nextRound,
    history: [...state.history, record],
    ended: nextRound > state.config.numRounds,
  };
}

export function isGameOver(state: CleanupState) {
  return state.ended;
}

