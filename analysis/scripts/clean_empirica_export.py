#!/usr/bin/env python3
"""Clean an Empirica export or shared-schema file into a flat CSV."""

from __future__ import annotations

import argparse
import json
from typing import Any

from _common import read_records, text, write_records


def clean_record(record: dict[str, Any]) -> dict[str, Any]:
    cleaned = {normalize_key(key): parse_value(value) for key, value in record.items()}
    if "actor_id" not in cleaned:
        cleaned["actor_id"] = cleaned.get("player_id") or cleaned.get("participant_id")
    if "game_id" not in cleaned:
        cleaned["game_id"] = cleaned.get("game") or cleaned.get("gameid")
    if "group_id" not in cleaned:
        cleaned["group_id"] = cleaned.get("group") or cleaned.get("groupid")
    return cleaned


def normalize_key(key: str) -> str:
    return key.strip().replace("-", "_").replace(" ", "_").lower()


def parse_value(value: Any) -> Any:
    value = text(value)
    if not value:
        return ""
    if value.startswith("{") or value.startswith("["):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("output")
    args = parser.parse_args()
    write_records(args.output, [clean_record(record) for record in read_records(args.input)])


if __name__ == "__main__":
    main()

