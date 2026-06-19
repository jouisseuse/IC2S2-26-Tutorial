#!/usr/bin/env python3
"""Compute public goods payoffs from player-round contribution data."""

from __future__ import annotations

import argparse

from _common import group_by, number, read_records, write_records


def compute(records: list[dict], endowment: float, multiplier: float) -> list[dict]:
    output = []
    for key, grouped in group_by(records, ["game_id", "group_id", "round"]).items():
        contributions = [number(row.get("action_value", row.get("contribution"))) for row in grouped]
        total = sum(contributions)
        public_return = total * multiplier / len(grouped) if grouped else 0
        for row, contribution in zip(grouped, contributions):
            payoff = endowment - contribution + public_return
            output.append(
                {
                    **row,
                    "contribution": contribution,
                    "total_contribution": total,
                    "average_contribution": total / len(grouped) if grouped else "",
                    "public_return": public_return,
                    "computed_payoff": payoff,
                    "game_id": key[0],
                    "group_id": key[1],
                    "round": key[2],
                }
            )
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("output")
    parser.add_argument("--endowment", type=float, default=10)
    parser.add_argument("--multiplier", type=float, default=1.5)
    args = parser.parse_args()
    write_records(args.output, compute(read_records(args.input), args.endowment, args.multiplier))


if __name__ == "__main__":
    main()

