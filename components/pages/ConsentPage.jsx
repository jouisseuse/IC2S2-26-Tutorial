import React from "react";

export function ConsentPage({ title = "Consent", children, onContinue, disabled = false }) {
  return (
    <main className="experiment-page consent-page">
      <h1>{title}</h1>
      <div>{children}</div>
      <button disabled={disabled} onClick={onContinue} type="button">
        Continue
      </button>
    </main>
  );
}

export default ConsentPage;
