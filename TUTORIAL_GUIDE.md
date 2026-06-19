# Tutorial Guide

This guide maps the three-hour tutorial to the repository folders.

The tutorial is organized around five design questions:

1. Who are the agents?
2. What actions can they take?
3. What information do they receive?
4. How do they interact?
5. What outcomes emerge?

## Before the Tutorial

Checklist:

- Clone the repository.
- Install dependencies for the minimal example once available.
- Copy `.env.example` to `.env`.
- Run the minimal human-only example.
- Open two participant windows.
- Run the mock LLM simulation.
- Read [SETUP_BACKUP.md](SETUP_BACKUP.md) if setup fails.

Folders to inspect:

- `README.md`
- `SETUP.md`
- `REPO_MAP.md`
- `hands_on/exercise_00_check_setup/`

## During the Tutorial

### Part 1: Why Multiplayer Experiments?

Time: 20 minutes

Open:

- `slides/`
- `docs/01_what_is_multiplayer_experiment.md`
- `docs/02_design_framework.md`

Goal: Explain why social behavior often requires interacting participants, not isolated responses.

### Part 2: Empirica for Human Experiments

Time: 25 minutes

Open:

- `engines/empirica/`
- `examples/human_only/00_minimal_two_player_choice/`

Goal: Introduce Empirica as the human experiment engine.

### Exercise 1: Run Minimal Experiment

Time: 25 minutes

Open:

- `hands_on/exercise_01_run_minimal_experiment/`
- `engines/empirica/human_only/minimal_two_player_choice/`

Goal: Run a two-player, one-round experiment.

### Exercise 2: Modify Public Goods Game

Time: 30 minutes

Open:

- `hands_on/exercise_02_modify_public_goods_game/`
- `examples/human_only/01_public_goods/`
- `shared/game_logic/public_goods/`

Goal: Modify group size, rounds, endowment, multiplier, and feedback.

### Exercise 3: Add Social Information

Time: 25 minutes

Open:

- `hands_on/exercise_03_add_social_information/`
- `shared/configs/`
- `components/widgets/SocialInformationBox.jsx`

Goal: Understand information structure as an experimental manipulation.

### Exercise 4: Run LLM Only Simulation

Time: 25 minutes

Open:

- `hands_on/exercise_04_run_llm_only_simulation/`
- `engines/llm_simulation/`
- `shared/prompts/public_goods/`

Goal: Run the same game logic without human participants using mock LLM agents.

### Exercise 5: Run Mixed Human and LLM Experiment

Time: 25 minutes

Open:

- `hands_on/exercise_05_run_mixed_human_llm_experiment/`
- `engines/mixed_human_llm/`
- `examples/mixed_human_llm/06_mixed_public_goods/`

Goal: Combine human participants and LLM agents in the same game.

### Exercise 6: Export and Analyze Data

Time: 20 minutes

Open:

- `hands_on/exercise_06_export_and_analyze_data/`
- `analysis/`
- `shared/schemas/`

Goal: Reconstruct player round, group round, and game level outcomes.

### Exercise 7: Design Your Own Experiment

Time: 5 minutes

Open:

- `hands_on/exercise_07_design_your_own_experiment/`
- `assets/templates/design_worksheet.pdf.placeholder`

Goal: Leave with one concrete experiment design.

## After the Tutorial

Checklist:

- Choose the closest example.
- Modify config files.
- Modify game logic only when the rules change.
- Modify prompts only when LLM agent instructions change.
- Run a small pilot.
- Export data.
- Analyze player round and group round outcomes separately.

Recommended next folders:

- `examples/`
- `shared/game_logic/`
- `shared/prompts/`
- `analysis/`
