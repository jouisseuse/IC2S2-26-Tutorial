#!/usr/bin/env python3
"""Reconstruct one row per actor per round from action/event records."""

from __future__ import annotations

import argparse

from _common import group_by, number, read_records, write_records


def reconstruct(records: list[dict]) -> list[dict]:
    keys = ["game_id", "group_id", "round", "actor_id"]
    rows = []
    for key, grouped in group_by(records, keys).items():
        action_records = [row for row in grouped if row.get("action_type") or row.get("event_type") == "action_submitted"]
        payoff_values = [number(row.get("payoff"), 0) for row in grouped if row.get("payoff") not in (None, "")]
        last_action = action_records[-1] if action_records else grouped[-1]
        rows.append(
            {
                "game_id": key[0],
                "group_id": key[1],
                "round": key[2],
                "actor_id": key[3],
                "actor_type": last_action.get("actor_type", ""),
                "stage": last_action.get("stage", ""),
                "action_type": last_action.get("action_type", ""),
                "action_value": last_action.get("action_value", ""),
                "payoff": sum(payoff_values) if payoff_values else last_action.get("payoff", ""),
                "treatment": last_action.get("treatment", ""),
                "n_source_records": len(grouped),
            }
        )
    return sorted(rows, key=lambda row: (str(row["game_id"]), str(row["group_id"]), int(float(row["round"] or 0)), str(row["actor_id"])))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("output")
    args = parser.parse_args()
    write_records(args.output, reconstruct(read_records(args.input)))


if __name__ == "__main__":
    main()

