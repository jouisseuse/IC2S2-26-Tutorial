import { runBatchSimulation } from "./run_batch";

const batchSize = Number(process.argv[2] || 20);

runBatchSimulation(batchSize).then((outputs) => {
  console.log(`Wrote ${outputs.length} batch simulations.`);
});
