import type {
  CoordinationAction,
  CoordinationChoice,
  CoordinationConfig,
  CoordinationRoundRecord,
  CoordinationState,
} from "./coordination.types";

export function createInitialState(
  config: CoordinationConfig,
  actorIds?: string[]
): CoordinationState {
  const ids =
    actorIds && actorIds.length > 0
      ? actorIds
      : Array.from({ length: config.groupSize }, (_, index) => `player_${index + 1}`);

  return {
    gameId: config.gameId || "coordination_game",
    groupId: config.groupId || "group_1",
    config: {
      gameId: config.gameId || "coordination_game",
      groupId: config.groupId || "group_1",
      groupSize: config.groupSize,
      numRounds: config.numRounds,
      matchPayoff: config.matchPayoff,
      mismatchPayoff: config.mismatchPayoff,
      treatment: config.treatment || "control",
    },
    round: 1,
    actorIds: ids,
    history: [],
    ended: false,
  };
}

export function getObservationForAgent(state: CoordinationState, actorId: string) {
  if (!state.actorIds.includes(actorId)) {
    throw new Error(`Unknown actorId: ${actorId}`);
  }
  const previous = state.history[state.history.length - 1];
  return {
    game_id: state.gameId,
    group_id: state.groupId,
    actor_id: actorId,
    round: state.round,
    choices: ["A", "B"],
    previous_majority_choice: previous?.majorityChoice ?? null,
    previous_coordinated: previous?.coordinated ?? null,
    treatment: state.config.treatment,
  };
}

export function validateAction(state: CoordinationState, action: CoordinationAction) {
  if (state.ended) return { valid: false, reason: "game is already over" };
  if (!state.actorIds.includes(action.actorId)) return { valid: false, reason: "unknown actor" };
  if (!["A", "B"].includes(action.choice)) return { valid: false, reason: "choice must be A or B" };
  return { valid: true };
}

export function applyActions(
  state: CoordinationState,
  actions: CoordinationAction[],
  timestamp = new Date().toISOString()
): CoordinationState {
  for (const action of actions) {
    const result = validateAction(state, action);
    if (!result.valid) throw new Error(`Invalid action: ${result.reason}`);
  }

  const choices = state.actorIds.map((actorId) => {
    const action = actions.find((entry) => entry.actorId === actorId);
    return {
      actorId,
      choice: action?.choice || "A",
      round: state.round,
      timestamp,
    };
  });
  const coordinated = new Set(choices.map((entry) => entry.choice)).size === 1;
  const majorityChoice = getMajorityChoice(choices.map((entry) => entry.choice));
  const record: CoordinationRoundRecord = {
    gameId: state.gameId,
    groupId: state.groupId,
    round: state.round,
    choices,
    coordinated,
    majorityChoice,
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

export function computePayoffs(state: CoordinationState, record: CoordinationRoundRecord) {
  return record.choices.map((choice) => ({
    actorId: choice.actorId,
    payoff: record.coordinated ? state.config.matchPayoff : state.config.mismatchPayoff,
  }));
}

export function isGameOver(state: CoordinationState) {
  return state.ended;
}

function getMajorityChoice(choices: CoordinationChoice[]): CoordinationChoice | null {
  const countA = choices.filter((choice) => choice === "A").length;
  const countB = choices.length - countA;
  if (countA === countB) return null;
  return countA > countB ? "A" : "B";
}

