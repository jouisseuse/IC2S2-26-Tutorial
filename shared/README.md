# Shared

This folder contains the reusable core of the repository.

Game logic, schemas, configs, prompts, logging, and utility functions should live here when they are independent of any specific engine.

## Who Should Use This

Use this folder if you are defining rules, data structures, prompts, or configuration that should work across human-only, LLM-only, and mixed experiments.

## What Should Be Added Later

- Engine-independent game logic for public goods, coordination, social learning, and cleanup games
- Shared JSON schemas for actions, observations, events, players, games, payoffs, and LLM calls
- Config files for game parameters, agents, models, treatments, and logging
- Prompt templates with structured output examples
- Standard event and LLM call loggers

## What Not To Put Here

Do not put Empirica-specific UI code, browser pages, model-provider credentials, or tutorial-only exercise instructions here. Empirica code belongs in `engines/empirica/`, UI components belong in `components/`, and exercises belong in `hands_on/`.

## Completion Standard

The same public goods logic should be usable by the Empirica engine, the LLM simulation engine, and the mixed human-LLM bridge.
