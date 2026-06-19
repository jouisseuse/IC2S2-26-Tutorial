#!/usr/bin/env python3
"""Check that the first-version repository files exist."""

from __future__ import annotations

from pathlib import Path
import sys

REQUIRED = [
    "README.md",
    "SETUP.md",
    "SETUP_BACKUP.md",
    "TUTORIAL_GUIDE.md",
    "REPO_MAP.md",
    "CONTENT_REQUIREMENTS.md",
    ".env.example",
    "engines/empirica/human_only/minimal_two_player_choice/package.json",
    "engines/empirica/human_only/minimal_two_player_choice/client/src/Game.jsx",
    "engines/empirica/human_only/minimal_two_player_choice/server/src/callbacks.js",
    "engines/llm_simulation/runner/run_mock_simulation.ts",
    "shared/game_logic/public_goods/public_goods.logic.ts",
    "shared/schemas/action.schema.json",
    "analysis/scripts/reconstruct_player_round_data.py",
]


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    missing = [path for path in REQUIRED if not (root / path).exists()]
    if missing:
        print("Missing required files:")
        for path in missing:
            print(f"- {path}")
        return 1
    print(f"All {len(REQUIRED)} required files are present.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
