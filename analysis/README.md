# Analysis

This folder contains scripts, notebooks, sample data, and figures for analyzing multiplayer experiment data.

Important: multiplayer data are not independent individual observations. Participants in the same group influence each other. Analyze player-level, player-round, group-round, game-level, message-level, and LLM-call-level data separately when appropriate.

## Who Should Use This

Use this folder if you are cleaning exports, reconstructing player-round or group-round data, merging LLM logs, computing outcomes, or creating plots.

## What Should Be Added Later

- Sample exported data for human-only, LLM-only, and mixed experiments
- Python and R cleaning scripts
- Notebooks for public goods, social learning, and human versus LLM comparisons
- Example figures for tutorial and paper use

## What Not To Put Here

Do not put experiment runtime code, UI components, prompts, or game rules here. Runtime code belongs in `engines/`, UI belongs in `components/`, prompts belong in `shared/prompts/`, and game rules belong in `shared/game_logic/`.

## Completion Standard

A user should be able to load sample data, reconstruct group outcomes, merge LLM call logs, and create basic plots from exported data.

## Scripts

`analysis/scripts/` contains data analysis scripts only. Use it for cleaning raw exports, reconstructing player-round and group-round data, merging LLM logs, computing outcomes, generating summaries, and preparing figures.

Experiment runners belong in `engines/`, not in `analysis/scripts/`.
