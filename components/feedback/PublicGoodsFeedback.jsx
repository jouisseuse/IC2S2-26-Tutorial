import React from "react";
import { PayoffTable } from "../widgets/PayoffTable";

export function PublicGoodsFeedback({ totalContribution, averageContribution, rows = [] }) {
  return (
    <section className="public-goods-feedback">
      <h2>Group feedback</h2>
      <p>Total contribution: {totalContribution}</p>
      <p>Average contribution: {averageContribution}</p>
      <PayoffTable rows={rows} />
    </section>
  );
}

export default PublicGoodsFeedback;
