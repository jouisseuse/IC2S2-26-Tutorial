import React from "react";

export function InstructionPage({ title = "Instructions", sections = [], onContinue }) {
  return (
    <main className="experiment-page instruction-page">
      <h1>{title}</h1>
      {sections.map((section, index) => (
        <section key={section.title || index}>
          {section.title && <h2>{section.title}</h2>}
          <p>{section.body}</p>
        </section>
      ))}
      {onContinue && (
        <button onClick={onContinue} type="button">
          Continue
        </button>
      )}
    </main>
  );
}

export default InstructionPage;
