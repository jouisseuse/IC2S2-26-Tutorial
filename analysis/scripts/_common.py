#!/usr/bin/env python3
"""Shared helpers for lightweight data analysis scripts."""

from __future__ import annotations

import csv
import json
import zipfile
from pathlib import Path
from typing import Any, Iterable


def read_records(path: str | Path) -> list[dict[str, Any]]:
    source = Path(path)
    if source.suffix == ".zip":
        return read_zip_records(source)
    if source.suffix == ".jsonl":
        return [json.loads(line) for line in source.read_text().splitlines() if line.strip()]
    if source.suffix == ".json":
        data = json.loads(source.read_text())
        return data if isinstance(data, list) else [data]
    with source.open(newline="") as handle:
        return list(csv.DictReader(handle))


def read_zip_records(path: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    with zipfile.ZipFile(path) as archive:
        for name in archive.namelist():
            if not name.endswith(".csv"):
                continue
            with archive.open(name) as handle:
                text = handle.read().decode("utf-8")
            reader = csv.DictReader(text.splitlines())
            for row in reader:
                row["_source_file"] = name
                records.append(row)
    return records


def write_records(path: str | Path, records: Iterable[dict[str, Any]]) -> None:
    rows = list(records)
    output = Path(path)
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.suffix == ".jsonl":
        output.write_text("".join(json.dumps(row) + "\n" for row in rows))
        return
    fieldnames = sorted({key for row in rows for key in row.keys()})
    with output.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def number(value: Any, default: float = 0.0) -> float:
    try:
        if value in (None, ""):
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def text(value: Any, default: str = "") -> str:
    if value is None:
        return default
    return str(value)


def group_by(records: Iterable[dict[str, Any]], keys: list[str]) -> dict[tuple[Any, ...], list[dict[str, Any]]]:
    grouped: dict[tuple[Any, ...], list[dict[str, Any]]] = {}
    for record in records:
        key = tuple(record.get(field) for field in keys)
        grouped.setdefault(key, []).append(record)
    return grouped
