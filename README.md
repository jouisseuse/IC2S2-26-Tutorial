# Multiplayer Experiment Framework

A reusable tutorial and research framework for designing, running, and analyzing multiplayer behavioral experiments, including human only experiments, LLM only simulations, and mixed human AI experiments.

This repository is not only an Empirica tutorial. Empirica is the human experiment engine. The broader goal is to teach a general framework for designing multiplayer behavioral experiments.

## Who This Repo Is For

- Psychologists and behavioral scientists learning multiplayer experiment design
- Computational social scientists comparing humans, LLM agents, and mixed groups
- Tutorial participants who want guided modification rather than coding from scratch
- Collaborators building reusable examples for future workshops and papers

## What Users Will Learn

- How to describe a multiplayer experiment in terms of agents, actions, information, interaction, and outcomes
- How to run human only experiments with Empirica
- How to run LLM only simulations with mock agents by default
- How to combine human participants and LLM agents in mixed experiments
- How to reconstruct player round, group round, and game level data

## Three Experiment Modes

1. Human only experiments: real participants interact through Empirica.
2. LLM only simulations: LLM or mock agents interact without a browser.
3. Mixed human and LLM experiments: human participants and LLM agents act in the same game.

## Core Architecture

```text
Game logic
    |
    v
Engine
    |
    v
Agents
    |
    v
Actions
    |
    v
Data
    |
    v
Analysis
```

- Game logic defines the rules.
- Engine defines where the experiment runs.
- Agents define who acts: human, LLM, scripted, or random.
- Models define how LLM agents respond.
- Prompts define how LLM agents receive information.
- Analysis reconstructs individual and group level outcomes.

The key design principle is to keep these parts separate. Users should be able to change game rules, agent composition, treatment conditions, prompts, model providers, and analysis scripts without rewriting the full project.

## Quick Start

The first runnable examples are still being built. For now:

```bash
git clone https://github.com/jouisseuse/multiplayer-experiment-framework.git
cd multiplayer-experiment-framework
cp .env.example .env
```

Then read:

- [SETUP.md](SETUP.md)
- [TUTORIAL_GUIDE.md](TUTORIAL_GUIDE.md)
- [REPO_MAP.md](REPO_MAP.md)
- [CONTENT_REQUIREMENTS.md](CONTENT_REQUIREMENTS.md)

## Tutorial Path

1. Run a minimal two-player human experiment.
2. Modify a public goods game.
3. Add social information as a treatment.
4. Run an LLM only simulation with a mock model.
5. Run a mixed human and LLM experiment.
6. Export and analyze multiplayer data.
7. Design your own experiment.

## Repository Structure

- `slides/`: Teaching slides, scripts, figures, and speaker notes
- `hands_on/`: Guided tutorial exercises
- `engines/`: Empirica, LLM simulation, and mixed human-LLM runners
- `shared/`: Game logic, schemas, configs, prompts, and logging
- `components/`: Reusable Empirica UI components
- `examples/`: Complete examples users can copy and modify
- `analysis/`: Sample data, scripts, notebooks, and figures
- `docs/`: Conceptual documentation
- `assets/`: Screenshots, videos, diagrams, and worksheet templates
- `external_links/`: Curated learning resources

## Minimal Examples

The minimum first version will focus on:

- `engines/empirica/human_only/minimal_two_player_choice`
- `examples/human_only/00_minimal_two_player_choice`
- `hands_on/exercise_01_run_minimal_experiment`
- `engines/llm_simulation`
- `examples/llm_only/04_public_goods_llm_simulation`
- `analysis/notebooks/python/01_analyze_public_goods.ipynb`

## Citation

Citation metadata will be maintained in [CITATION.cff](CITATION.cff).

## License

The license is not finalized yet. See [LICENSE](LICENSE).
