import React from "react";

export function SocialLearningFeedback({ estimate, groupAverage, trueValue = null }) {
  const error =
    trueValue === null || trueValue === undefined ? null : Math.abs(groupAverage - trueValue);
  return (
    <section className="social-learning-feedback">
      <h2>Social learning feedback</h2>
      <p>Your estimate: {estimate}</p>
      <p>Group average: {groupAverage}</p>
      {error !== null && <p>Group error: {error}</p>}
    </section>
  );
}

export default SocialLearningFeedback;
