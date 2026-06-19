import { runPublicGoodsSimulation } from "./run_simulation";

runPublicGoodsSimulation().then(({ records, outputBase }) => {
  console.log(`Wrote ${records.length} public goods records to ${outputBase}.*`);
});
