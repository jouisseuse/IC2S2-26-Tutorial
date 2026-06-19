import React from "react";

export function PayoffTable({ rows = [] }) {
  return (
    <table className="payoff-table">
      <thead>
        <tr>
          <th>Player</th>
          <th>Action</th>
          <th>Payoff</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.actorId || row.label}>
            <td>{row.label || row.actorId}</td>
            <td>{row.action ?? ""}</td>
            <td>{row.payoff ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PayoffTable;
