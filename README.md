# Multiplayer Experiment Framework

This repository contains tutorial code for running the TogetherHire hiring experiment and a companion MultiLLM simulation.

TogetherHire is an Empirica experiment where participants act as hiring managers and learn from reward feedback across repeated decisions. MultiLLM provides a Python version of the same multi-agent bandit idea using LLM agents.

## What Is Here

- `code/TogetherHire/`: source files and Empirica configuration for the human participant experiment.
- `code/MultiLLM/`: Python code for running the LLM simulation.
- `materials/`: slides, figures, handouts, or notes for the tutorial.
- `SETUP.md`: copy-paste setup instructions.

## Start Here

Open [SETUP.md](SETUP.md) and follow the steps in order.

The basic workflow is:

1. Clone this repository.
2. Create a fresh Empirica app with `empirica create`.
3. Replace the generated client/server files with `code/TogetherHire`.
4. Install Node dependencies.
5. Run the Empirica experiment.
6. Optionally run the Python MultiLLM simulation.

## Dependency Policy

This repository does not commit generated local folders such as `node_modules/`, `dist/`, `__pycache__/`, or `.empirica/local/`.

Instead, it commits the source files and dependency manifests needed to rebuild the local environment:

- `package.json`
- `package-lock.json`
- `requirements.txt`

This keeps the repository smaller and more portable across different machines.
