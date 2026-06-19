import React from "react";

export function TwoColumnLayout({ left, right }) {
  return (
    <div className="two-column-layout">
      <section>{left}</section>
      <section>{right}</section>
    </div>
  );
}

export default TwoColumnLayout;
