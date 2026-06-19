import React from "react";

export function LLMStatusBadge({ status = "idle", model = "mock" }) {
  return (
    <span className={`llm-status-badge llm-status-${status}`}>
      {model}: {status}
    </span>
  );
}

export default LLMStatusBadge;
