#!/usr/bin/env python3
"""Merge behavioral records with LLM call logs."""

from __future__ import annotations

import argparse

from _common import read_records, write_records


JOIN_KEYS = ["game_id", "group_id", "round", "stage", "actor_id"]


def merge_behavior_and_llm(behavior: list[dict], llm_logs: list[dict]) -> list[dict]:
    indexed = {tuple(str(row.get(key, "")) for key in JOIN_KEYS): row for row in llm_logs}
    merged = []
    for row in behavior:
        key = tuple(str(row.get(field, "")) for field in JOIN_KEYS)
        llm = indexed.get(key, {})
        merged.append(
            {
                **row,
                "model_provider": llm.get("model_provider", ""),
                "model_name": llm.get("model_name", ""),
                "prompt_id": llm.get("prompt_id", ""),
                "raw_response": llm.get("raw_response", ""),
                "parsed_action": llm.get("parsed_action", ""),
                "latency_ms": llm.get("latency_ms", ""),
                "llm_error": llm.get("error", ""),
            }
        )
    return merged


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("behavior")
    parser.add_argument("llm_logs")
    parser.add_argument("output")
    args = parser.parse_args()
    write_records(args.output, merge_behavior_and_llm(read_records(args.behavior), read_records(args.llm_logs)))


if __name__ == "__main__":
    main()

