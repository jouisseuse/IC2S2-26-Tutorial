import type {
  ActorType,
  PublicGoodsAction,
  PublicGoodsConfig,
  PublicGoodsObservation,
  PublicGoodsPayoff,
  PublicGoodsRoundRecord,
  PublicGoodsState,
} from "./public_goods.types";

const DEFAULT_GAME_ID = "public_goods_game";
const DEFAULT_GROUP_ID = "group_1";

export function createInitialState(
  config: PublicGoodsConfig,
  actorIds?: string[],
  actorType: ActorType = "human"
): PublicGoodsState {
  assertPositiveInteger(config.groupSize, "groupSize");
  assertPositiveInteger(config.numRounds, "numRounds");
  assertNonNegativeNumber(config.endowment, "endowment");
  assertPositiveNumber(config.multiplier, "multiplier");

  const ids =
    actorIds && actorIds.length > 0
      ? actorIds
      : Array.from({ length: config.groupSize }, (_, index) => `player_${index + 1}`);

  if (ids.length !== config.groupSize) {
    throw new Error("actorIds length must match groupSize");
  }

  return {
    gameId: config.gameId || DEFAULT_GAME_ID,
    groupId: config.groupId || DEFAULT_GROUP_ID,
    config: {
      gameId: config.gameId || DEFAULT_GAME_ID,
      groupId: config.groupId || DEFAULT_GROUP_ID,
      groupSize: config.groupSize,
      numRounds: config.numRounds,
      endowment: config.endowment,
      multiplier: config.multiplier,
      treatment: config.treatment || "control",
      feedbackType: config.feedbackType || "group",
    },
    round: 1,
    players: ids.map((actorId) => ({ actorId, actorType, totalPayoff: 0 })),
    history: [],
    ended: false,
  };
}

export function getObservationForAgent(
  state: PublicGoodsState,
  actorId: string
): PublicGoodsObservation {
  const player = state.players.find((entry) => entry.actorId === actorId);
  if (!player) {
    throw new Error(`Unknown actorId: ${actorId}`);
  }

  const previousRound = state.history[state.history.length - 1];
  const previousOwnPayoff = previousRound?.payoffs.find(
    (entry) => entry.actorId === actorId
  );

  return {
    gameId: state.gameId,
    groupId: state.groupId,
    actorId,
    round: state.round,
    endowment: state.config.endowment,
    multiplier: state.config.multiplier,
    groupSize: state.config.groupSize,
    treatment: state.config.treatment,
    feedbackType: state.config.feedbackType,
    previousOwnContribution: previousOwnPayoff?.contribution ?? null,
    previousGroupAverage: previousRound?.averageContribution ?? null,
    totalPayoff: player.totalPayoff,
    isFinalRound: state.round >= state.config.numRounds,
  };
}

export function validateAction(
  state: PublicGoodsState,
  action: PublicGoodsAction
): { valid: true } | { valid: false; reason: string } {
  if (state.ended) {
    return { valid: false, reason: "game is already over" };
  }
  if (!state.players.some((player) => player.actorId === action.actorId)) {
    return { valid: false, reason: "unknown actor" };
  }
  if (action.round !== undefined && action.round !== state.round) {
    return { valid: false, reason: "action round does not match state round" };
  }
  if (!Number.isFinite(action.contribution)) {
    return { valid: false, reason: "contribution must be a finite number" };
  }
  if (action.contribution < 0 || action.contribution > state.config.endowment) {
    return { valid: false, reason: "contribution is outside the endowment range" };
  }
  return { valid: true };
}

export function computePayoffs(
  state: PublicGoodsState,
  actions: PublicGoodsAction[]
): PublicGoodsPayoff[] {
  const actionByActor = new Map(actions.map((action) => [action.actorId, action]));
  const contributions = state.players.map((player) => {
    const contribution = actionByActor.get(player.actorId)?.contribution ?? 0;
    return clamp(contribution, 0, state.config.endowment);
  });
  const totalContribution = contributions.reduce((sum, value) => sum + value, 0);
  const publicReturn =
    (totalContribution * state.config.multiplier) / state.config.groupSize;

  return state.players.map((player, index) => {
    const contribution = contributions[index];
    const privateReturn = state.config.endowment - contribution;
    return {
      actorId: player.actorId,
      contribution,
      privateReturn,
      publicReturn,
      payoff: privateReturn + publicReturn,
    };
  });
}

export function applyActions(
  state: PublicGoodsState,
  actions: PublicGoodsAction[],
  timestamp = new Date().toISOString()
): PublicGoodsState {
  const seen = new Set<string>();
  for (const action of actions) {
    const result = validateAction(state, action);
    if (!result.valid) {
      throw new Error(`Invalid action for ${action.actorId}: ${result.reason}`);
    }
    if (seen.has(action.actorId)) {
      throw new Error(`Duplicate action for actor: ${action.actorId}`);
    }
    seen.add(action.actorId);
  }

  const payoffs = computePayoffs(state, actions);
  const totalContribution = payoffs.reduce(
    (sum, payoff) => sum + payoff.contribution,
    0
  );
  const record: PublicGoodsRoundRecord = {
    gameId: state.gameId,
    groupId: state.groupId,
    round: state.round,
    treatment: state.config.treatment,
    totalContribution,
    averageContribution: totalContribution / state.config.groupSize,
    multiplier: state.config.multiplier,
    endowment: state.config.endowment,
    payoffs,
    actions: state.players.map((player) => {
      const action = actions.find((entry) => entry.actorId === player.actorId);
      return {
        actorId: player.actorId,
        actorType: player.actorType,
        round: state.round,
        contribution: action?.contribution ?? 0,
        timestamp,
      };
    }),
    timestamp,
  };

  const players = state.players.map((player) => {
    const payoff = payoffs.find((entry) => entry.actorId === player.actorId);
    return {
      ...player,
      totalPayoff: player.totalPayoff + (payoff?.payoff ?? 0),
    };
  });

  return advanceRound({
    ...state,
    players,
    history: [...state.history, record],
  });
}

export function advanceRound(state: PublicGoodsState): PublicGoodsState {
  if (state.round >= state.config.numRounds) {
    return { ...state, ended: true };
  }
  return { ...state, round: state.round + 1 };
}

export function isGameOver(state: PublicGoodsState): boolean {
  return state.ended || state.round > state.config.numRounds;
}

export function exportRoundData(state: PublicGoodsState): Record<string, unknown>[] {
  return state.history.flatMap((record) =>
    record.payoffs.map((payoff) => ({
      game_id: record.gameId,
      group_id: record.groupId,
      round: record.round,
      actor_id: payoff.actorId,
      actor_type:
        state.players.find((player) => player.actorId === payoff.actorId)?.actorType ||
        "human",
      action_type: "contribution",
      action_value: payoff.contribution,
      payoff: payoff.payoff,
      total_contribution: record.totalContribution,
      average_contribution: record.averageContribution,
      treatment: record.treatment,
      timestamp: record.timestamp,
    }))
  );
}

function assertPositiveInteger(value: number, field: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive integer`);
  }
}

function assertNonNegativeNumber(value: number, field: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${field} must be a non-negative number`);
  }
}

function assertPositiveNumber(value: number, field: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${field} must be a positive number`);
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

