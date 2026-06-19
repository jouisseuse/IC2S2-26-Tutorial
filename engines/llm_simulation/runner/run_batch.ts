import { runPublicGoodsSimulation } from "./run_simulation";

export async function runBatchSimulation(batchSize = 20) {
  const outputs = [];
  for (let index = 0; index < batchSize; index += 1) {
    outputs.push(
      await runPublicGoodsSimulation({
        outputBase: `engines/llm_simulation/outputs/public_goods_batch_${index + 1}`,
      })
    );
  }
  return outputs;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const batchSize = Number(process.argv[2] || 20);
  runBatchSimulation(batchSize).then((outputs) => {
    console.log(`Wrote ${outputs.length} mock public goods simulations.`);
  });
}

