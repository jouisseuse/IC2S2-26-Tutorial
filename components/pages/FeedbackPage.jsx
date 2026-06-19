import React from "react";

export function FeedbackPage({ title = "Feedback", rows = [], onContinue }) {
  return (
    <main className="experiment-page feedback-page">
      <h1>{title}</h1>
      <table>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {onContinue && (
        <button onClick={onContinue} type="button">
          Continue
        </button>
      )}
    </main>
  );
}

export default FeedbackPage;
