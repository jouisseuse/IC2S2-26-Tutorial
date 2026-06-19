import React from "react";

export function ProgressBar({ value = 0, max = 1, label = "Progress" }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="progress-bar" aria-label={label}>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span>{Math.round(percent)}%</span>
    </div>
  );
}

export default ProgressBar;
