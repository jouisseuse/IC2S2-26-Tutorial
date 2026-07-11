import { ClassicListenersCollector } from "@empirica/core/admin/classic";

export const Empirica = new ClassicListenersCollector();

const CANDIDATE_OPTIONS = [
  "Crimson",
  "Bright Green",
  "Amber",
  "Purple",
  "Sky Blue",
  "Pink",
  "Indigo",
  "Slate",
  "Orange",
  "Black",
];

const CANDIDATE_PROBABILITIES = {
  Crimson: 0.53,
  "Bright Green": 0.95,
  Amber: 0.3,
  Purple: 0.1,
  "Sky Blue": 0.68,
  Pink: 0.4,
  Indigo: 0.16,
  Slate: 0.8,
  Orange: 0.22,
  Black: 0.12,
};

function createInitialResults() {
  return Object.fromEntries(
    CANDIDATE_OPTIONS.map((option) => [option, { success: 1, failures: 1 }])
  );
}


function sampleReward(candidateName) {
  const probability = CANDIDATE_PROBABILITIES[candidateName] ?? 0.5;
  return Math.random() < probability ? 1 : 0;
}

function updateCumulativeResults(results, candidateName, score) {
  if (!results[candidateName]) {
    results[candidateName] = { success: 1, failures: 1 };
  }

  if (score === 1) {
    results[candidateName].success += 1;
  } else {
    results[candidateName].failures += 1;
  }
}

Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment") || {};
  const { numRounds = 0, chatEnabled = false, type = "non-communication" } = treatment;

  console.log(`Game started with treatment: ${type}, chatEnabled: ${chatEnabled}`);

  game.set("cumulativeResults", createInitialResults());

  if (Array.isArray(game.players)) {
    game.players.forEach((player, index) => {
      const assignedChoice = CANDIDATE_OPTIONS[index % CANDIDATE_OPTIONS.length];

      player.set("cumulativeResults", createInitialResults());
      player.set("tutorialChoice", assignedChoice);

      console.log(`Initialized Player ${player.id}: tutorialChoice=${assignedChoice}`);
    });
  } else {
    console.error("Players is not defined or not an array:", game.players);
  }

  if (type === "communication" || type === "non-communication") {
    addIntroductionRound(game, chatEnabled);
    addTutorialRound(game, chatEnabled);
    addRounds(game, numRounds, chatEnabled);
    addPostGameSurvey(game, chatEnabled);
  } else if (type === "combined") {
    console.log("Setting up Combined-Treatment...");

    addIntroductionRound(game, false);
    addTutorialRound(game, false);
    addRounds(game, numRounds, false);

    addIntroductionRound(game, true);
    addRounds(game, numRounds, true);
  } else {
    console.error(`Unknown treatment: ${type}`);
  }
});

function addIntroductionRound(game, chatEnabled) {
  const introRound = game.addRound({
    name: chatEnabled ? "Communication Mode Introduction" : "Non-Communication Introduction",
    chatEnabled,
    flag: false,
  });

  introRound.addStage({ name: "introduction", duration: 60 });
}

function addTutorialRound(game, chatEnabled) {
  const tutorialRound = game.addRound({
    name: "Tutorial Round",
    isTutorial: true,
    flag: true,
    chatEnabled,
  });

  tutorialRound.addStage({ name: "choice", duration: 60 });
}

function addRounds(game, numRounds, chatEnabled) {
  for (let i = 0; i < numRounds; i++) {
    const round = game.addRound({
      name: `${chatEnabled ? "Communication" : "Non-Communication"} Round ${i + 1}`,
      chatEnabled,
      flag: true,
      isTutorial: false,
    });

    round.addStage({ name: "choice", duration: 30 });
  }
}

function addPostGameSurvey(game, chatEnabled) {
  const postSurveyRound = game.addRound({
    name: "Post-Survey",
    chatEnabled,
  });

  postSurveyRound.addStage({ name: "Group-Allocation", duration: 200 });
}

Empirica.onRoundStart(({ round }) => {
  console.log(`Round started: ${round.get("name")}, Chat Enabled: ${round.get("chatEnabled")}, tutorial: ${round.get("isTutorial")}`);
});

Empirica.onStageStart(({ stage }) => {
  console.log(`Stage started: ${stage.get("name")}, Chat Enabled: ${stage.round.get("chatEnabled")}`);
});

Empirica.onStageEnded(({ stage }) => {
  console.log(`Stage ended: ${stage.get("name")}, Chat Enabled: ${stage.round.get("chatEnabled")}`);
});

Empirica.onRoundEnded(({ round }) => {
  if (round.get("flag") !== true) return;

  const game = round.currentGame;
  const players = game.players || [];
  const cumulativeResultsGame = game.get("cumulativeResults") || createInitialResults();

  players.forEach((player) => {
    const playerChoice = player.round.get("decision");

    if (!playerChoice) {
      console.error(`Player ${player.id} is missing a valid choice for this round.`);
      return;
    }

    let score = player.round.get("score");
    if (typeof score !== "number") {
      score = sampleReward(playerChoice);
      player.round.set("score", score);
    }

    updateCumulativeResults(cumulativeResultsGame, playerChoice, score);

    const cumulativeResultsPlayer = player.get("cumulativeResults") || createInitialResults();
    updateCumulativeResults(cumulativeResultsPlayer, playerChoice, score);
    player.set("cumulativeResults", cumulativeResultsPlayer);

    const totalScore = player.get("score") || 0;
    const newScore = totalScore + score;
    player.set("score", newScore);
    console.log(`Player ${player.id} score updated: ${totalScore} -> ${newScore}`);
  });

  game.set("cumulativeResults", cumulativeResultsGame);
});

Empirica.onGameEnded(({ game }) => {
  console.log(`Game ended. Treatment: ${game.get("treatment").type}`);
});
