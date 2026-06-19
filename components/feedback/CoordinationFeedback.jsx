import React from "react";

export function CoordinationFeedback({ coordinated = false, majorityChoice = null }) {
  return (
    <section className="coordination-feedback">
      <h2>Coordination feedback</h2>
      <p>{coordinated ? "The group coordinated." : "The group did not coordinate."}</p>
      <p>Majority choice: {majorityChoice || "tie"}</p>
    </section>
  );
}

export default CoordinationFeedback;
