import { runSocialLearningSimulation } from "./run_simulation";

runSocialLearningSimulation().then(({ records, outputBase }) => {
  console.log(`Wrote ${records.length} social learning records to ${outputBase}.*`);
});
