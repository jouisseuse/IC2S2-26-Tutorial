import React from "react";

export function Timer({ secondsRemaining = 0 }) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  return (
    <span className="timer" aria-label="Time remaining">
      {minutes}:{String(seconds).padStart(2, "0")}
    </span>
  );
}

export default Timer;
