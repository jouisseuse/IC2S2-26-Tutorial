import {
  usePlayer,
  useStage,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React from "react";
import { Choice } from "./stages/Choice";
import { Result } from "./stages/Result";
import { GameIntroduction } from "./stages/GameIntroduction";
import { GroupAllocation } from "./stages/GroupAllocation.jsx";

export function Stage() {
  const player = usePlayer();
  const stage = useStage();

  if (player.stage.get("submit")) {
    return (
      <div className="text-center text-gray-400 pointer-events-none">
        Please wait for other player(s).
      </div>
    );
  }

  switch (stage.get("name")) {
    case "introduction":
      return <GameIntroduction />;
    case "choice":
      return <Choice />;
    case "result":
      return <Result />;
    case "Group-Allocation":
      return <GroupAllocation />;
    default:
      return <Loading />;
  }
}
