import { ClassicListenersCollector } from "@empirica/core/admin/classic";

export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  const round = game.addRound({
    name: "Round 1",
    task: "minimal_choice",
  });

  round.addStage({ name: "Decision", duration: 120 });
  round.addStage({ name: "Feedback", duration: 60 });
});

Empirica.onStageEnded(({ stage }) => {
  if (stage.get("name") !== "Decision") {
    return;
  }

  const players = stage.currentGame.players;
  const choices = players.map((player) => ({
    playerId: player.id,
    participantIdentifier: player.get("participantIdentifier"),
    choice: player.round.get("choice") || null,
  }));

  const validChoices = choices.filter((entry) => entry.choice);
  const allSubmitted = validChoices.length === players.length;
  const sameChoice =
    allSubmitted && new Set(validChoices.map((entry) => entry.choice)).size === 1;
  const groupOutcome = allSubmitted
    ? sameChoice
      ? "same choice"
      : "different choices"
    : "missing choice";

  for (const player of players) {
    const ownChoice = player.round.get("choice") || null;
    const partner = players.find((otherPlayer) => otherPlayer.id !== player.id);

    player.round.set("partnerChoice", partner?.round.get("choice") || null);
    player.round.set("groupOutcome", groupOutcome);
    player.round.set("choiceSubmitted", Boolean(ownChoice));
  }

  stage.currentGame.set("minimalChoiceLog", {
    choices,
    groupOutcome,
    completedAt: new Date().toISOString(),
  });
});

