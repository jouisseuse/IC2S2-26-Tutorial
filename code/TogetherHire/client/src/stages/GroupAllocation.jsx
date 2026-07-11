import React, { useMemo, useState } from "react";
import { usePlayer, useRound, useGame } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { candidateOptions, sortCandidatesForTutorial } from "../candidateConfig";
import "@unocss/reset/tailwind-compat.css";

const TOTAL_SLOTS = 100;

export function GroupAllocation() {
  const player = usePlayer();
  const game = useGame();
  const round = useRound();
  const chatEnabled = round.get("chatEnabled");
  const tutorialChoice = player.get("tutorialChoice");

  const [allocations, setAllocations] = useState({});
  const [remainingSlots, setRemainingSlots] = useState(TOTAL_SLOTS);

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

  const handleInputChange = (groupName, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    const totalAllocated = Object.entries(allocations).reduce(
      (sum, [key, val]) => sum + (key === groupName ? num : Number(val) || 0),
      0
    );

    if (totalAllocated <= TOTAL_SLOTS) {
      setAllocations((prev) => ({ ...prev, [groupName]: num }));
      setRemainingSlots(TOTAL_SLOTS - totalAllocated);
    }
  };

  const handleSubmit = () => {
    player.set("groupAllocations", allocations);
    player.stage.set("submit", true);
  };

  return (
    <div className="mt-3 sm:mt-5 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Group Allocation</h2>
      <p className="text-gray-600 mb-4 text-center text-lg">
        🎉 Congratulations! This is the <strong>final task</strong> of the game. The closer your answers are to the true productivity, the higher your <strong>bonus</strong> will be! 💰
      </p>
      <p className="text-gray-600 mb-4 text-center text-lg">
        After observing the groups' performance during the game, allocate <strong>{TOTAL_SLOTS}</strong> hires across the groups based on their productivity.
      </p>
      <p className="text-center text-gray-800 font-bold mb-4">Remaining Slots: {remainingSlots}</p>

      <div className="grid grid-cols-5 gap-3 items-center justify-center px-4 relative">
        {sortedOptions.map((option) => (
          <div key={option.name} className="relative flex flex-col items-center">
            <Button
              className={`m-1 ${option.color} w-24 h-24 rounded-lg flex items-center justify-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
                <path d="M12 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 2c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4z" />
              </svg>
            </Button>
            <div className="text-sm mt-2 text-center">
              <span className="text-green-800 font-bold">
                Success: {cumulativeResults[option.name]?.success || 1}
              </span>
              <br />
              <span className="text-red-600 font-bold">
                Failures: {cumulativeResults[option.name]?.failures || 1}
              </span>
            </div>
            <input
              type="number"
              min="0"
              max={TOTAL_SLOTS}
              className="mt-2 border border-gray-300 rounded p-1 text-center w-16"
              value={allocations[option.name] || 0}
              onChange={(e) => handleInputChange(option.name, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={remainingSlots > 0}
          className={`px-6 py-2 rounded text-white font-bold ${
            remainingSlots === 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit Allocation
        </button>
      </div>
    </div>
  );
}
