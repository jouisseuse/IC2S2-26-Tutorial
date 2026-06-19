import React, { useState } from "react";
import { MultipleChoice } from "../forms/MultipleChoice";

export function ComprehensionCheckPage({ questions = [], onSubmit }) {
  const [answers, setAnswers] = useState({});

  return (
    <main className="experiment-page comprehension-check-page">
      <h1>Comprehension Check</h1>
      {questions.map((question) => (
        <MultipleChoice
          key={question.id}
          label={question.label}
          options={question.options}
          value={answers[question.id] || ""}
          onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
        />
      ))}
      <button onClick={() => onSubmit?.(answers)} type="button">
        Submit
      </button>
    </main>
  );
}

export default ComprehensionCheckPage;
