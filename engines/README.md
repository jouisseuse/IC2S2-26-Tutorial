# Engines

This folder contains the different ways multiplayer experiments can run.

- `empirica/`: Human participant experiments using Empirica
- `llm_simulation/`: LLM-only simulations without a browser
- `mixed_human_llm/`: Bridges that combine Empirica human participants with LLM agents

## Who Should Use This

Use this folder if you are implementing how an experiment runs: in Empirica, in a command-line LLM simulation, or in a mixed human and LLM setting.

## What Should Be Added Later

- Minimal human-only Empirica example
- Public goods Empirica example
- LLM simulation runner using mock models by default
- Mixed human and LLM bridge
- Config loading utilities
- Data export utilities that write the shared schema

## What Not To Put Here

Do not put reusable game rules directly inside an engine. Game logic belongs in `shared/game_logic/`. Do not put prompts directly inside engines; prompts belong in `shared/prompts/`. Do not put general analysis scripts here; those belong in `analysis/`.

## Completion Standard

Engines should import shared game logic and export shared data formats. A user should be able to change the engine without rewriting the rules of the game.
