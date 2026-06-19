#!/usr/bin/env python3
"""Compute social learning group averages and errors."""

from __future__ import annotations

import argparse

from _common import group_by, number, read_records, write_records


def compute(records: list[dict], true_value: float | None) -> list[dict]:
    output = []
    for key, grouped in group_by(records, ["game_id", "group_id", "round"]).items():
        estimates = [number(row.get("action_value", row.get("estimate"))) for row in grouped]
        group_average = sum(estimates) / len(estimates) if estimates else 0
        error = abs(group_average - true_value) if true_value is not None else ""
        for row, estimate in zip(grouped, estimates):
            output.append(
                {
                    **row,
                    "estimate": estimate,
                    "group_average": group_average,
                    "distance_from_group_average": abs(estimate - group_average),
                    "absolute_error": error,
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
    parser.add_argument("--true-value", type=float, default=None)
    args = parser.parse_args()
    write_records(args.output, compute(read_records(args.input), args.true_value))


if __name__ == "__main__":
    main()

