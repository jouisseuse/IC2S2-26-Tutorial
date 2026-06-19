import { applyActions, createInitialState, getObservationForAgent } from "./social_learning.logic";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const state = createInitialState(
  { groupSize: 2, numRounds: 1, trueValue: 50, showGroupAverage: true },
  ["p1", "p2"]
);
const next = applyActions(state, [
  { actorId: "p1", estimate: 40, confidence: 0.7 },
  { actorId: "p2", estimate: 60, confidence: 0.6 },
]);
assert(next.history[0].groupAverage === 50, "average estimate");
assert(next.history[0].absoluteError === 0, "absolute error");
assert(getObservationForAgent(next, "p1").previous_group_average === 50, "social info");

