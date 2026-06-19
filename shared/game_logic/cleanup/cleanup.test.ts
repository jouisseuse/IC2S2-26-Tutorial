import { applyActions, createInitialState } from "./cleanup.logic";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const state = createInitialState(
  {
    groupSize: 2,
    numRounds: 1,
    endowment: 10,
    cleanupCost: 1,
    pollutionStart: 20,
    pollutionReductionPerEffort: 2,
  },
  ["p1", "p2"]
);
const next = applyActions(state, [
  { actorId: "p1", effort: 3 },
  { actorId: "p2", effort: 2 },
]);
assert(next.pollution === 10, "pollution should fall by total effort times reduction");

