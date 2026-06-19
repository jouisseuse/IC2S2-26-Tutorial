#!/usr/bin/env python3
"""Reconstruct one row per group per round from player-round data."""

from __future__ import annotations

import argparse

from _common import group_by, number, read_records, write_records


def reconstruct(records: list[dict]) -> list[dict]:
    rows = []
    for key, grouped in group_by(records, ["game_id", "group_id", "round"]).items():
        action_values = [number(row.get("action_value")) for row in grouped if row.get("action_value") not in (None, "")]
        payoffs = [number(row.get("payoff")) for row in grouped if row.get("payoff") not in (None, "")]
        rows.append(
            {
                "game_id": key[0],
                "group_id": key[1],
                "round": key[2],
                "n_players": len({row.get("actor_id") for row in grouped}),
                "mean_action_value": sum(action_values) / len(action_values) if action_values else "",
                "total_action_value": sum(action_values) if action_values else "",
                "mean_payoff": sum(payoffs) / len(payoffs) if payoffs else "",
                "total_payoff": sum(payoffs) if payoffs else "",
                "treatment": grouped[0].get("treatment", ""),
            }
        )
    return sorted(rows, key=lambda row: (str(row["game_id"]), str(row["group_id"]), int(float(row["round"] or 0))))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("output")
    args = parser.parse_args()
    write_records(args.output, reconstruct(read_records(args.input)))


if __name__ == "__main__":
    main()

