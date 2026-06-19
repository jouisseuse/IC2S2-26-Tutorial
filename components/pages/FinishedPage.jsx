import React from "react";

export function FinishedPage({ title = "Finished", message = "Thank you for participating." }) {
  return (
    <main className="experiment-page finished-page">
      <h1>{title}</h1>
      <p>{message}</p>
    </main>
  );
}

export default FinishedPage;
