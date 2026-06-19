import React from "react";

export function StageLayout({ title, timer, progress, children }) {
  return (
    <section className="stage-layout">
      <header>
        <div>
          <h1>{title}</h1>
          {progress}
        </div>
        {timer}
      </header>
      <div>{children}</div>
    </section>
  );
}

export default StageLayout;
