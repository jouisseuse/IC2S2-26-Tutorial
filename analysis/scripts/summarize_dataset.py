#!/usr/bin/env python3
"""Summarize rows, actors, games, groups, rounds, and actor types."""

from __future__ import annotations

import argparse

from _common import read_records, write_records


def summarize(records: list[dict]) -> list[dict]:
    return [
        {
            "n_rows": len(records),
            "n_games": len({row.get("game_id") for row in records if row.get("game_id")}),
            "n_groups": len({row.get("group_id") for row in records if row.get("group_id")}),
            "n_rounds": len({row.get("round") for row in records if row.get("round") not in (None, "")}),
            "n_actors": len({row.get("actor_id") for row in records if row.get("actor_id")}),
            "actor_types": ";".join(sorted({str(row.get("actor_type")) for row in records if row.get("actor_type")})),
        }
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("output")
    args = parser.parse_args()
    write_records(args.output, summarize(read_records(args.input)))


if __name__ == "__main__":
    main()
