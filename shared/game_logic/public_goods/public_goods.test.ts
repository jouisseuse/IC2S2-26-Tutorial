import {
  applyActions,
  createInitialState,
  exportRoundData,
  getObservationForAgent,
  isGameOver,
} from "./public_goods.logic";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const state = createInitialState(
  { groupSize: 2, numRounds: 1, endowment: 10, multiplier: 1.5 },
  ["p1", "p2"]
);

const afterRound = applyActions(state, [
  { actorId: "p1", contribution: 4 },
  { actorId: "p2", contribution: 6 },
]);

assert(isGameOver(afterRound), "game should end after one round");
assert(afterRound.history[0].totalContribution === 10, "total contribution");
assert(afterRound.history[0].averageContribution === 5, "average contribution");

const p1Payoff = afterRound.history[0].payoffs.find((entry) => entry.actorId === "p1");
assert(Boolean(p1Payoff), "p1 payoff exists");
assert(p1Payoff?.payoff === 13.5, "p1 payoff should be 13.5");

const observation = getObservationForAgent(afterRound, "p1");
assert(observation.previousGroupAverage === 5, "previous average visible");

const rows = exportRoundData(afterRound);
assert(rows.length === 2, "exports one row per player");

