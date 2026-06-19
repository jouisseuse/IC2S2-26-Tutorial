import React from "react";

export function RoundHistory({ rounds = [] }) {
  return (
    <table className="round-history">
      <thead>
        <tr>
          <th>Round</th>
          <th>Action</th>
          <th>Group outcome</th>
          <th>Payoff</th>
        </tr>
      </thead>
      <tbody>
        {rounds.map((round) => (
          <tr key={round.round}>
            <td>{round.round}</td>
            <td>{round.action ?? ""}</td>
            <td>{round.groupOutcome ?? ""}</td>
            <td>{round.payoff ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RoundHistory;
