# Multiplayer Experiment Framework

A reusable tutorial and research framework for designing, running, and analyzing multiplayer behavioral experiments, including human-only experiments, LLM-only simulations, and mixed human-AI experiments.

This repository is not only an Empirica tutorial. Empirica is one experiment engine for running real-time human participant experiments. The broader goal is to provide a general framework for multiplayer behavioral experiments.

## Who This Is For

- Researchers designing multiplayer behavioral experiments
- Psychologists learning real-time interaction experiments
- Tutorial participants who want guided modification rather than coding from scratch
- Researchers comparing human-only, LLM-only, and mixed human-LLM settings

## Supported Modes

1. Human-only multiplayer experiments
2. LLM-only multiplayer simulations
3. Mixed human-LLM multiplayer experiments

## Core Design Principle

Separate the parts that researchers often need to modify:

- Game logic
- Engine
- Agent type
- Model
- Prompt
- Data analysis

Every experiment should answer:

1. Who are the agents?
2. What can they do?
3. What information do they receive?
4. How do they affect each other?
5. What individual and group outcomes emerge?
6. How should the resulting data be analyzed?

## Quick Start

TODO: Add quick start command after the first runnable example is implemented.

For now, start with:

- [SETUP.md](SETUP.md)
- [TUTORIAL_GUIDE.md](TUTORIAL_GUIDE.md)
- [REPO_MAP.md](REPO_MAP.md)

## Minimum Viable Tutorial Path

1. Run a minimal two-player experiment
2. Modify a public goods game
3. Run an LLM-only public goods simulation
4. Export and analyze multiplayer data

## Citation

TODO: Update [CITATION.cff](CITATION.cff) before release.

## Repository TODO

- [ ] Add conceptual diagram
- [ ] Add quick start command
- [ ] Link to tutorial guide sections
- [ ] Link to runnable examples
- [ ] Link to analysis scripts
- [ ] Add release citation

