import {
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React from "react";

const OPTIONS = [
  { value: "A", label: "Option A" },
  { value: "B", label: "Option B" },
];

export function Game() {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();

  if (!stage) {
    return <Loading />;
  }

  const stageName = stage.get("name");

  return (
    <main className="page">
      <section className="panel">
        <p className="eyebrow">Minimal two-player experiment</p>
        <h1>{stageName}</h1>
        <PlayerStatus player={player} players={players} />
        {stageName === "Decision" ? (
          <DecisionStage player={player} />
        ) : (
          <FeedbackStage player={player} players={players} />
        )}
      </section>
    </main>
  );
}

function PlayerStatus({ player, players }) {
  return (
    <p className="status">
      You are participant {player.get("participantIdentifier") || "unknown"}.
      Connected players: {players.length}.
    </p>
  );
}

function DecisionStage({ player }) {
  const submitted = player.stage.get("submit");
  const choice = player.round.get("choice");

  if (submitted) {
    return (
      <div className="notice">
        You chose {choice}. Please wait for the other participant.
      </div>
    );
  }

  function submitChoice(value) {
    player.round.set("choice", value);
    player.stage.set("submit", true);
  }

  return (
    <div>
      <p>
        Choose one option. The feedback page will show whether both players
        made the same choice.
      </p>
      <div className="choiceGrid">
        {OPTIONS.map((option) => (
          <button
            className="choiceButton"
            key={option.value}
            onClick={() => submitChoice(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedbackStage({ player, players }) {
  const ownChoice = player.round.get("choice") || "missing";
  const partnerChoice = player.round.get("partnerChoice") || "missing";
  const outcome = player.round.get("groupOutcome") || "not computed";

  return (
    <div>
      <p className="notice">
        Group outcome: <strong>{outcome}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th>Your choice</th>
            <td>{ownChoice}</td>
          </tr>
          <tr>
            <th>Other participant</th>
            <td>{partnerChoice}</td>
          </tr>
          <tr>
            <th>Players in game</th>
            <td>{players.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

