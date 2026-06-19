import { runPublicGoodsSimulation } from "./run_simulation";

runPublicGoodsSimulation().then(({ records, outputBase }) => {
  console.log(`Wrote ${records.length} records to ${outputBase}.jsonl and ${outputBase}.csv`);
});
