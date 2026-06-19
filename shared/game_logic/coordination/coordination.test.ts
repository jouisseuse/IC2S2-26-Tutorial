import { applyActions, computePayoffs, createInitialState } from "./coordination.logic";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const state = createInitialState(
  { groupSize: 2, numRounds: 1, matchPayoff: 5, mismatchPayoff: 0 },
  ["p1", "p2"]
);
const next = applyActions(state, [
  { actorId: "p1", choice: "A" },
  { actorId: "p2", choice: "A" },
]);
assert(next.history[0].coordinated, "players should coordinate");
assert(computePayoffs(next, next.history[0])[0].payoff === 5, "match payoff");

