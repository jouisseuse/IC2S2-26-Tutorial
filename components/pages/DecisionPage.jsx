import React from "react";

export function DecisionPage({ title = "Decision", prompt, children, onSubmit, disabled = false }) {
  return (
    <main className="experiment-page decision-page">
      <h1>{title}</h1>
      {prompt && <p>{prompt}</p>}
      <div>{children}</div>
      {onSubmit && (
        <button disabled={disabled} onClick={onSubmit} type="button">
          Submit
        </button>
      )}
    </main>
  );
}

export default DecisionPage;
