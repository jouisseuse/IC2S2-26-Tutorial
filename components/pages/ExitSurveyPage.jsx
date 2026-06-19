import React, { useState } from "react";
import { TextResponse } from "../forms/TextResponse";

export function ExitSurveyPage({ questions = [], onSubmit }) {
  const [responses, setResponses] = useState({});

  return (
    <main className="experiment-page exit-survey-page">
      <h1>Exit Survey</h1>
      {questions.map((question) => (
        <TextResponse
          key={question.id}
          label={question.label}
          value={responses[question.id] || ""}
          onChange={(value) => setResponses({ ...responses, [question.id]: value })}
        />
      ))}
      <button onClick={() => onSubmit?.(responses)} type="button">
        Submit
      </button>
    </main>
  );
}

export default ExitSurveyPage;
