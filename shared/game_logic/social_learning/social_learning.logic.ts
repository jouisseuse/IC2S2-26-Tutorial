import type {
  SocialLearningAction,
  SocialLearningConfig,
  SocialLearningRoundRecord,
  SocialLearningState,
} from "./social_learning.types";

export function createInitialState(
  config: SocialLearningConfig,
  actorIds?: string[]
): SocialLearningState {
  const ids =
    actorIds && actorIds.length > 0
      ? actorIds
      : Array.from({ length: config.groupSize }, (_, index) => `player_${index + 1}`);

  return {
    gameId: config.gameId || "social_learning_game",
    groupId: config.groupId || "group_1",
    config: {
      gameId: config.gameId || "social_learning_game",
      groupId: config.groupId || "group_1",
      groupSize: config.groupSize,
      numRounds: config.numRounds,
      trueValue: config.trueValue ?? Number.NaN,
      treatment: config.treatment || "control",
      showGroupAverage: config.showGroupAverage ?? false,
    },
    round: 1,
    actorIds: ids,
    history: [],
    ended: false,
  };
}

export function getObservationForAgent(state: SocialLearningState, actorId: string) {
  if (!state.actorIds.includes(actorId)) {
    throw new Error(`Unknown actorId: ${actorId}`);
  }
  const previous = state.history[state.history.length - 1];
  return {
    game_id: state.gameId,
    group_id: state.groupId,
    actor_id: actorId,
    round: state.round,
    treatment: state.config.treatment,
    show_group_average: state.config.showGroupAverage,
    previous_group_average: state.config.showGroupAverage
      ? previous?.groupAverage ?? null
      : null,
    previous_own_estimate:
      previous?.estimates.find((entry) => entry.actorId === actorId)?.estimate ?? null,
  };
}

export function validateAction(state: SocialLearningState, action: SocialLearningAction) {
  if (state.ended) return { valid: false, reason: "game is already over" };
  if (!state.actorIds.includes(action.actorId)) return { valid: false, reason: "unknown actor" };
  if (!Number.isFinite(action.estimate)) return { valid: false, reason: "estimate must be finite" };
  if (
    action.confidence !== undefined &&
    (!Number.isFinite(action.confidence) || action.confidence < 0 || action.confidence > 1)
  ) {
    return { valid: false, reason: "confidence must be between 0 and 1" };
  }
  return { valid: true };
}

export function applyActions(
  state: SocialLearningState,
  actions: SocialLearningAction[],
  timestamp = new Date().toISOString()
): SocialLearningState {
  for (const action of actions) {
    const result = validateAction(state, action);
    if (!result.valid) throw new Error(`Invalid action: ${result.reason}`);
  }

  const estimates = state.actorIds.map((actorId) => {
    const action = actions.find((entry) => entry.actorId === actorId);
    return {
      actorId,
      estimate: action?.estimate ?? 0,
      confidence: action?.confidence,
      round: state.round,
      timestamp,
    };
  });
  const groupAverage =
    estimates.reduce((sum, entry) => sum + entry.estimate, 0) / estimates.length;
  const absoluteError = Number.isFinite(state.config.trueValue)
    ? Math.abs(groupAverage - state.config.trueValue)
    : null;
  const record: SocialLearningRoundRecord = {
    gameId: state.gameId,
    groupId: state.groupId,
    round: state.round,
    estimates,
    groupAverage,
    absoluteError,
    timestamp,
  };
  const nextRound = state.round + 1;
  return {
    ...state,
    round: nextRound,
    history: [...state.history, record],
    ended: nextRound > state.config.numRounds,
  };
}

export function isGameOver(state: SocialLearningState) {
  return state.ended;
}

