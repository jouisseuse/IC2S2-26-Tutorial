import { usePlayer, useRound, useGame, useStageTimer } from "@empirica/core/player/classic/react";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { candidateOptions, sortCandidatesForTutorial } from "../candidateConfig";
import "@unocss/reset/tailwind-compat.css";

export function Choice() {
  const player = usePlayer();
  const round = useRound();
  const game = useGame();
  const chatEnabled = round.get("chatEnabled");
  const isTutorial = round.get("isTutorial");
  const tutorialChoice = player.get("tutorialChoice");
  const timer = useStageTimer();

  const [showWarning, setShowWarning] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    if (timer?.remaining || timer?.remaining === 0) {
      const remaining = Math.round(timer.remaining / 1000);
      setShowWarning(remaining <= 10 && remaining > 0);
    }
  }, [timer]);

  const sortedOptions = useMemo(
    () => sortCandidatesForTutorial(candidateOptions, tutorialChoice),
    [tutorialChoice]
  );

  const cumulativeResults = useMemo(() => {
    if (chatEnabled) {
      return game.get("cumulativeResults") || {};
    }
    return player.get("cumulativeResults") || {};
  }, [chatEnabled, game, player]);

  function onClick(candidate) {
    if (isTutorial && candidate.name !== tutorialChoice) {
      setShowWarningModal(true);
      return;
    }

    player.round.set("decision", candidate.name);
    player.stage.set("submit", true);
  }

  return (
    <div className="mt-3 sm:mt-5 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {isTutorial ? "Tutorial: Learn How to Play" : "Hiring Game: Select Your Candidate"}
      </h2>
      <p className="text-gray-600 mb-4 text-center text-lg min-h-[60px]">
        {isTutorial ? (
          <span>
            Follow the instructions in this tutorial round. Please select the{" "}
            <strong>indicated</strong> one. 😊
          </span>
        ) : (
          <span>
            Select the candidate you believe is <strong>most productive</strong>. 🌟
          </span>
        )}
      </p>

      {showWarning && (
        <div className="text-center text-red-600 font-bold mb-4 min-h-[24px]">
          ⚠️ Hurry up!! Only{" "}
          <span className="tabular-nums">{Math.max(Math.round(timer?.remaining / 1000), 0)}</span> seconds left to make your choice! 🚨
        </div>
      )}

      {showWarningModal && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <div className="text-2xl text-red-600 font-bold mb-4">⚠️ Attention</div>
            <p className="text-gray-800 text-lg mb-4">
              In the tutorial, you must select the <strong>indicated</strong> one to proceed.
            </p>
            <button
              onClick={() => setShowWarningModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-3 items-center justify-center px-4 relative">
        {sortedOptions.map((option, index) => (
          <div key={option.name} className="relative flex flex-col items-center">
            {isTutorial && index === 0 && (
              <div className="absolute -top-14 flex justify-center w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-14 h-14 fill-gray-700 animate-bounce"
                >
                  <path d="M12 2v20m-5-5l5 5 5-5" />
                </svg>
              </div>
            )}
            <Button
              className={`m-1 ${option.color} w-24 h-24 hover:scale-105 transition-all rounded-lg flex items-center justify-center`}
              handleClick={() => onClick(option)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
                <path d="M12 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 2c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4z" />
              </svg>
            </Button>
            <div className="text-center mt-2">
              <span className="text-green-800 font-bold">
                Success:{" "}
                <span className="text-2xl font-extrabold">
                  {cumulativeResults[option.name]?.success || 1}
                </span>
              </span>
              <br />
              <span className="text-red-600 font-bold">
                Failure:{" "}
                <span className="text-2xl font-extrabold">
                  {cumulativeResults[option.name]?.failures || 1}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
