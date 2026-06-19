# Multiplayer Experiment Framework Content Requirements

## Repository Goal

This repository is a tutorial and reusable research framework for multiplayer behavioral experiments.

It supports three modes:

1. Human only experiments
2. LLM only simulations
3. Mixed human and LLM experiments

The repo should not be only an Empirica tutorial. Empirica is one engine for human participant experiments. The broader contribution is a framework for designing, implementing, and analyzing multiplayer experiments.

The core design principle is:

> Separate game logic from engine, agents, prompts, models, UI, and analysis.

Users should be able to change game logic, agent number, human versus LLM composition, treatment condition, prompt, model provider, and analysis script without rewriting the full project.

## Global Content Rules

### Language

All public facing repo content should be in English.

Internal notes can be bilingual, but files such as `README.md`, `SETUP.md`, tutorial instructions, and exercise guides should be English.

Reason: IC2S2 and future AMPPS readers will likely be international.

### Writing Style

Use simple explanations.

The audience is not professional software engineers. Assume the user is a psychologist, behavioral scientist, or computational social scientist who can run basic code but does not know Empirica or LLM agent infrastructure.

Every major file should answer:

- What is this?
- Why does it matter?
- How do I run it?
- What can I change?
- What should I see?
- What common mistakes should I avoid?

### Code Design Rules

1. Do not hard code game parameters inside UI components.
2. Do not hard code prompts inside game logic.
3. Do not hard code model names inside game logic.
4. Do not commit API keys.
5. Use mock LLM agents by default.
6. Make all examples runnable without paid API access.
7. Use the same output schema across human only, LLM only, and mixed experiments.
8. Keep first tutorial examples extremely simple.
9. Add starter and solution versions for hands on exercises.
10. Prefer configuration files over scattered constants.

## Root Directory Requirements

### `README.md`

Purpose: Explain the repo in less than two minutes.

Required sections:

1. Project title
2. One sentence description
3. Who this repo is for
4. What users will learn
5. Three experiment modes
6. Quick start
7. Tutorial path
8. Repository structure
9. Minimal examples
10. Citation
11. License

Suggested opening:

```markdown
# Multiplayer Experiment Framework

A reusable tutorial and research framework for designing, running, and analyzing multiplayer behavioral experiments, including human only experiments, LLM only simulations, and mixed human AI experiments.
```

Must include this conceptual diagram:

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

Must explain:

- Game logic defines the rules.
- Engine defines where the experiment runs.
- Agents define who acts.
- Models define how LLM agents respond.
- Prompts define how LLM agents receive information.
- Analysis reconstructs individual and group level outcomes.

Completion standard:

- A new visitor should understand the repo purpose within 30 seconds.
- A tutorial participant should know where to start.
- A collaborator should know where to add new examples.

### `SETUP.md`

Purpose: Help users run the repo.

Required sections:

1. System requirements
2. Clone the repository
3. Install dependencies
4. Set environment variables
5. Run human only Empirica example
6. Run LLM only simulation with mock model
7. Run mixed human and LLM example
8. Troubleshooting
9. Tutorial backup plan

Must include commands for:

- `git clone`
- `npm install`
- Copy `.env.example` to `.env`
- Run minimal human experiment
- Run mock LLM simulation

Must not require real API keys for the basic tutorial.

Required troubleshooting entries:

- Node version error
- Empirica command not found
- Port already in use
- Cannot open admin panel
- LLM API key missing
- Model call failed
- Data export not found

Completion standard:

- A participant should be able to run the minimal example before the tutorial.
- A participant without API keys should still complete the mock LLM exercise.

### `SETUP_BACKUP.md`

Purpose: Prevent tutorial failure when local setup breaks.

Required sections:

1. If installation fails
2. If Empirica does not run
3. If LLM API is unavailable
4. If participant windows do not connect
5. If time is short
6. Use sample data instead

Must include fallback options:

- Use screenshots
- Use sample exported data
- Pair with another participant
- Run mock simulation only
- Follow the instructor demo

Completion standard:

- The tutorial can continue even if 30 percent of participants have setup problems.

### `TUTORIAL_GUIDE.md`

Purpose: Give participants a step by step path through the three hour tutorial.

Required sections:

- Before the tutorial
- During the tutorial
- After the tutorial

Before tutorial checklist:

- Install dependencies
- Clone repo
- Run minimal example
- Open two participant windows
- Run mock LLM simulation

During tutorial checklist:

- Exercise 1: Run minimal experiment
- Exercise 2: Modify public goods game
- Exercise 3: Add social information
- Exercise 4: Run LLM only simulation
- Exercise 5: Run mixed human and LLM experiment
- Exercise 6: Export and analyze data
- Exercise 7: Design your own experiment

After tutorial checklist:

- Choose an example
- Modify config
- Modify game logic
- Modify prompts
- Run pilot
- Analyze exported data

Completion standard:

- A participant should know exactly which folder to open at each tutorial stage.

### `REPO_MAP.md`

Purpose: Explain where things live.

Required structure:

- `slides/`
- `hands_on/`
- `engines/`
- `shared/`
- `components/`
- `examples/`
- `analysis/`
- `docs/`
- `assets/`
- `external_links/`
- `tools/`

For each folder, explain:

- What it contains
- Who should use it
- When to modify it
- What not to put there

Completion standard:

- A contributor should know whether a new file belongs in `shared`, `engines`, `examples`, `components`, or `analysis`.

### `tools/`

Purpose: Store small repository-level helper commands.

Use `tools/` for:

- Checking whether the local environment has expected commands
- Checking whether required first-version files exist
- Copying `.env.example` to `.env`
- Scanning tracked files for likely committed API keys

Do not put experiment runners or data analysis scripts here.

- Data analysis scripts belong in `analysis/scripts/`.
- LLM simulation runners belong in `engines/llm_simulation/runner/`.
- Empirica runtime logic belongs in `engines/empirica/`.

### `.env.example`

Purpose: Show required environment variables without exposing secrets.

Required content:

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
LITELLM_BASE_URL=
LITELLM_API_KEY=
DEFAULT_MODEL=
USE_MOCK_MODEL=true
LOG_LLM_CALLS=true
```

Must include comments explaining:

- Mock model is the default for tutorials.
- Real model keys are optional.
- Never commit `.env`.

Completion standard:

- Users can copy this file to `.env` and run the mock examples immediately.

## `slides/` Requirements

Directory:

```text
slides/
  tutorial_slides.pptx
  tutorial_slides.pdf
  scripts/
  figures/
  speaker_notes/
```

Main slide deck requirements:

- Total length: 3 hours
- Slide based teaching: around 60 to 75 minutes
- Hands on exercises: around 90 to 105 minutes
- Discussion and buffer: around 15 to 30 minutes

Required sections:

1. Why multiplayer experiments
2. Core design framework
3. Human only experiments with Empirica
4. LLM only simulations
5. Mixed human and LLM experiments
6. Data structure and analysis
7. How to adapt the framework

Required diagrams:

- Agents, Actions, Information, Interaction, Outcomes
- Traditional experiment versus multiplayer experiment
- Human only, LLM only, and mixed human and LLM

Completion standard:

- The slides should teach intuition, not code details.
- Every code heavy part should point to `hands_on/` or `examples/`.

### `slides/scripts/`

Required files:

- `00_opening.md`
- `01_why_multiplayer_experiments.md`
- `02_design_framework.md`
- `03_empirica_for_human_experiments.md`
- `04_llm_agents.md`
- `05_mixed_human_llm_experiments.md`
- `06_data_analysis.md`
- `07_wrap_up.md`

Each script should include:

- Slide number
- Speaker script
- Key message
- Transition to next section
- Possible audience question

Completion standard:

- Someone else should be able to give the tutorial using the scripts.

### `slides/figures/`

Required figures:

- `traditional_vs_multiplayer.png`
- `agents_actions_information_outcomes.png`
- `human_only_llm_only_mixed.png`
- `engine_agent_game_logic_diagram.png`
- `multiplayer_data_structure.png`
- `empirica_lifecycle_simplified.png`
- `llm_agent_pipeline.png`

Completion standard:

- Figures should be clean enough to use both in slides and a future paper.

## `hands_on/` Requirements

Purpose: Live tutorial exercises.

Important rule: hands on should be guided modification, not coding from scratch.

Every exercise folder must include:

- `README.md`
- `starter/`
- `solution/`
- `tasks.md`
- `expected_output.md`
- `screenshots/`
- `discussion_questions.md`

Exception: the design worksheet does not need code.

Every exercise README must include:

- Goal
- Time needed
- What you will change
- Files to open
- Step by step instructions
- Expected output
- Common errors
- Discussion questions

### `exercise_00_check_setup/`

Goal: Confirm setup works.

Required tasks:

- Run minimal human only experiment
- Open admin panel
- Open two participant windows
- Complete one round
- Run mock LLM simulation
- Find exported data

Required screenshots:

- `terminal_running.png`
- `admin_panel.png`
- `participant_window_1.png`
- `participant_window_2.png`
- `mock_llm_output.png`

Completion standard:

- A participant can verify their setup in 10 minutes.

### `exercise_01_run_minimal_experiment/`

Goal: Understand a minimal multiplayer flow.

Experiment design:

- Two players
- One round
- One decision
- One feedback screen

Participant tasks:

- Run experiment
- Open two participant windows
- Make a choice as each participant
- View feedback
- Find the logged decision

Discussion questions:

- Who are the agents?
- What are the actions?
- What information does each player receive?
- What is the group outcome?
- What data are produced?

Completion standard:

- Participants understand the difference between individual response and multiplayer interaction.

### `exercise_02_modify_public_goods_game/`

Goal: Learn how game parameters affect behavior.

Required tasks:

- Change group size
- Change number of rounds
- Change endowment
- Change multiplier
- Add group contribution feedback
- Run the modified game

Required parameters:

- `group_size`
- `num_rounds`
- `endowment`
- `multiplier`
- `feedback_type`

Expected learning:

- Group incentives are defined in game logic and config, not in UI components.

Completion standard:

- Participants can modify the public goods game without touching unrelated files.

### `exercise_03_add_social_information/`

Goal: Show information structure as a manipulation.

Required treatments:

- Control: participants see only their own previous action.
- Social information: participants see the previous group average.

Required tasks:

- Add treatment config
- Compute previous group average
- Display group average in UI
- Log treatment condition
- Compare output data

Expected learning:

- A multiplayer treatment often changes who knows what and when.

Completion standard:

- Participants can explain the manipulation in terms of information structure.

### `exercise_04_run_llm_only_simulation/`

Goal: Run the same game without human participants.

Required features:

- Mock model works by default
- Config controls number of agents
- Config controls game parameters
- Config controls prompt profile
- Output uses shared schema

Required tasks:

- Run simulation
- Change number of LLM agents
- Change number of rounds
- Change prompt
- Change model profile
- Export data

Required files:

- `configs/agents.yaml`
- `configs/models.yaml`
- `configs/public_goods_llm.yaml`
- `prompts/public_goods/`
- `expected_output/`

Completion standard:

- Participants can run an LLM only version without Empirica and without real API keys.

### `exercise_05_run_mixed_human_llm_experiment/`

Goal: Combine human participants and LLM agents.

Required setup:

- Two human participants
- Two LLM agents
- Same public goods game logic
- Same output schema

Required tasks:

- Run mixed game
- Change number of human players
- Change number of LLM agents
- Change LLM prompt
- Change model profile
- Compare human and LLM actions

Must explain:

- LLM agents should use the same observation and action schema as human participants.

Completion standard:

- Participants understand how mixed experiments differ from human only experiments.

### `exercise_06_export_and_analyze_data/`

Goal: Analyze multiplayer data.

Required tasks:

- Load exported data
- Reconstruct player round data
- Reconstruct group round data
- Merge LLM call logs
- Plot behavior over rounds
- Compare human only, LLM only, and mixed settings

Required warning:

- Participants inside the same game are not independent observations.

Required sample data:

- `human_only_public_goods`
- `llm_only_public_goods`
- `mixed_public_goods`
- `social_learning`

Completion standard:

- Participants can move from raw export to interpretable group level outcomes.

### `exercise_07_design_your_own_experiment/`

Goal: Help users apply the framework.

Required files:

- `worksheet.md`
- `worksheet.pdf`
- `example_completed_worksheet.md`

Worksheet fields:

- Research question
- Agents
- Actions
- Information
- Interaction
- Treatment
- Individual outcome
- Group outcome
- Time dynamics
- Human only, LLM only, or mixed
- Data structure
- Ethical considerations

Completion standard:

- Participants leave with one concrete experiment design.

## `engines/` Requirements

Purpose: Separate where experiments run.

Directory:

```text
engines/
  empirica/
  llm_simulation/
  mixed_human_llm/
```

### `engines/empirica/`

Purpose: Human participant experiments.

Required subfolders:

- `human_only/`
- `mixed_human_llm/`
- `shared_empirica_utils/`

Required examples:

- `minimal_two_player_choice`
- `public_goods`
- `social_learning`

Required utilities:

- `create_rounds.ts`
- `create_stages.ts`
- `assign_players.ts`
- `export_data.ts`
- `load_config.ts`

Empirica examples must include:

- `README.md`
- `client/`
- `server/`
- `public/`
- `configs/`
- `sample_data/`
- `screenshots/`
- `package.json`

Completion standard:

- Human only examples run through Empirica.
- Game rules are imported from shared game logic when possible.

### `engines/llm_simulation/`

Purpose: Run multiplayer simulations without human participants.

Required files:

- `runner/run_simulation.ts`
- `runner/run_batch.ts`
- `agents/base_agent.ts`
- `agents/llm_agent.ts`
- `agents/scripted_agent.ts`
- `agents/random_agent.ts`
- `model_adapters/base_model_client.ts`
- `model_adapters/mock_model_client.ts`
- `model_adapters/openai_client.ts`
- `model_adapters/anthropic_client.ts`
- `model_adapters/litellm_client.ts`
- `configs/public_goods_llm.yaml`
- `configs/social_learning_llm.yaml`

Required behavior:

- Mock model is default.
- Real model adapters are optional.
- Number of agents is config driven.
- Prompts are loaded from shared prompts.
- Game logic is imported from shared game logic.
- Outputs use shared schemas.

Completion standard:

- A user can run 20 LLM only games from the command line and export data.

### `engines/mixed_human_llm/`

Purpose: Bridge Empirica human participants and LLM agents.

Required files:

- `bridge/agent_scheduler.ts`
- `bridge/human_action_collector.ts`
- `bridge/llm_action_collector.ts`
- `bridge/mixed_group_runner.ts`
- `bridge/action_merger.ts`
- `bridge/mixed_data_exporter.ts`

Required behavior:

- Human participants act through Empirica UI.
- LLM agents act through model adapter.
- Both produce the same action schema.
- Both receive compatible observations.
- Both are logged in the same event log.

Completion standard:

- Mixed public goods game runs with human and LLM agents in the same group.

## `shared/` Requirements

Purpose: The reusable core.

This is the most important directory.

Directory:

```text
shared/
  game_logic/
  schemas/
  configs/
  prompts/
  logging/
  utils/
```

### `shared/game_logic/`

Purpose: Define game rules independent from Empirica and LLM APIs.

Required games:

- `public_goods`
- `coordination`
- `social_learning`
- `cleanup`

Each game folder must include:

- `logic.ts`
- `types.ts`
- `test.ts`
- `README.md`

Each game logic module must define:

- Initial state
- Valid actions
- Observation function
- State transition
- Payoff calculation
- Round update
- End condition
- Data export fields

Required public goods functions:

- `createInitialState`
- `getObservationForAgent`
- `validateAction`
- `applyActions`
- `computePayoffs`
- `advanceRound`
- `isGameOver`
- `exportRoundData`

Completion standard:

- The same public goods logic can be used by Empirica, LLM simulation, and mixed experiment.

### `shared/schemas/`

Purpose: Standardize data.

Required schemas:

- `player.schema.json`
- `game.schema.json`
- `action.schema.json`
- `observation.schema.json`
- `event_log.schema.json`
- `llm_call.schema.json`
- `payoff.schema.json`

Required common fields:

- `game_id`
- `group_id`
- `round`
- `stage`
- `actor_id`
- `actor_type`
- `treatment`
- `timestamp`

Required action fields:

- `action_id`
- `actor_id`
- `actor_type`
- `game_id`
- `round`
- `stage`
- `action_type`
- `action_value`
- `is_valid`
- `timestamp`

Required LLM fields:

- `llm_call_id`
- `actor_id`
- `model_provider`
- `model_name`
- `prompt_id`
- `system_prompt`
- `user_prompt`
- `raw_response`
- `parsed_action`
- `latency_ms`
- `temperature`
- `max_tokens`
- `error`
- `timestamp`

Completion standard:

- Human only, LLM only, and mixed experiments export compatible data.

### `shared/configs/`

Purpose: Centralize modifiable experiment settings.

Required files:

- `experiment.yaml`
- `agents.yaml`
- `models.yaml`
- `treatments.yaml`

Required config fields:

- Game type
- Group size
- Number of rounds
- Endowment
- Multiplier
- Feedback type
- Human agent count
- LLM agent count
- Scripted agent count
- Model profile
- Prompt profile
- Treatment condition
- Logging options

Completion standard:

- A user can change agent number, prompt, model, and treatment without editing source code.

### `shared/prompts/`

Purpose: Keep prompts outside game logic.

Required folders:

- `public_goods/`
- `social_learning/`
- `coordination/`

Each prompt folder must include:

- `system.md`
- `decision.md`
- `reflection.md`
- `README.md`
- `example_response.json`

Prompt requirements:

- Tell the LLM its role.
- Describe the game state.
- Describe available actions.
- Require structured output.
- Forbid extra prose in the response.
- Include one valid example.

Completion standard:

- Changing a prompt does not require editing game logic.

### `shared/logging/`

Purpose: Standardized event logging.

Required files:

- `event_logger.ts`
- `llm_call_logger.ts`
- `data_exporter.ts`

Must log:

- Agent creation
- Game start
- Round start
- Observation shown
- Action submitted
- Invalid action
- Payoff computed
- LLM prompt
- LLM raw response
- LLM parsed action
- Game end

Completion standard:

- Every important event can be reconstructed from logs.

## `components/` Requirements

Purpose: Reusable Empirica UI components.

Rule:

- Components handle display and input only.
- Components should not define game rules.
- Components should not call LLM APIs.
- Components should not compute final payoffs.

Directory:

```text
components/
  pages/
  layouts/
  widgets/
  forms/
  feedback/
```

Required pages:

- `ConsentPage.jsx`
- `InstructionPage.jsx`
- `ComprehensionCheckPage.jsx`
- `DecisionPage.jsx`
- `FeedbackPage.jsx`
- `ExitSurveyPage.jsx`
- `LobbyPage.jsx`
- `FinishedPage.jsx`

Required widgets:

- `Timer.jsx`
- `ProgressBar.jsx`
- `PayoffTable.jsx`
- `GroupStatus.jsx`
- `RoundHistory.jsx`
- `SocialInformationBox.jsx`
- `ChatBox.jsx`
- `LLMStatusBadge.jsx`

Required forms:

- `LikertScale.jsx`
- `MultipleChoice.jsx`
- `NumericInput.jsx`
- `SliderInput.jsx`
- `TextResponse.jsx`
- `ContributionInput.jsx`
- `ConfidenceInput.jsx`

Each component must include:

- Short comment explaining purpose
- Props documented in README
- Minimal usage example
- No experiment specific hard coding

Completion standard:

- A user can build a new Empirica experiment by reusing pages and widgets.

## `examples/` Requirements

Purpose: Complete runnable examples.

Directory:

```text
examples/
  human_only/
  llm_only/
  mixed_human_llm/
  external_links/
```

Every example must include:

- `README.md`
- `configs/`
- `sample_data/`
- `screenshots/`
- `analysis_link.md`

Every example README must include:

- Research question
- Experiment design
- How to run
- What files to modify
- Expected output
- Data structure
- Connection to tutorial exercise

### Human Only Examples

Required examples:

- `00_minimal_two_player_choice`
- `01_public_goods`
- `02_coordination_game`
- `03_social_learning`

Completion standard:

- Each human only example can run through Empirica.

### LLM Only Examples

Required examples:

- `04_public_goods_llm_simulation`
- `05_social_learning_llm_simulation`

Required behavior:

- Use mock model by default.
- Allow real model if API key exists.
- Export data in shared schema.
- Allow config driven agent number.

Completion standard:

- A user can run LLM only simulations without opening a browser.

### Mixed Examples

Required examples:

- `06_mixed_public_goods`
- `07_mixed_social_learning`

Required behavior:

- Human agents use Empirica UI.
- LLM agents use model adapter.
- Both use shared game logic.
- Both export shared data schema.

Completion standard:

- A user can run a mixed human and LLM game and analyze both actor types together.

## `analysis/` Requirements

Purpose: Turn raw logs into interpretable behavioral data.

Directory:

```text
analysis/
  sample_data/
  scripts/
  notebooks/
  figures/
```

Required sample data:

- `human_only/public_goods`
- `human_only/social_learning`
- `llm_only/public_goods`
- `llm_only/social_learning`
- `mixed_human_llm/public_goods`
- `mixed_human_llm/social_learning`

Required scripts:

- `clean_empirica_export.py`
- `clean_empirica_export.R`
- `reconstruct_player_round_data.py`
- `reconstruct_group_round_data.py`
- `merge_llm_logs.py`
- `compute_public_goods_outcomes.py`
- `compute_social_learning_outcomes.py`

Required notebooks:

- `python/01_analyze_public_goods.ipynb`
- `python/02_analyze_social_learning.ipynb`
- `python/03_compare_human_llm_mixed.ipynb`
- `r/01_analyze_public_goods.Rmd`
- `r/02_analyze_social_learning.Rmd`
- `r/03_compare_human_llm_mixed.Rmd`

Required analysis concepts:

- Player level data
- Player round level data
- Group round level data
- Game level data
- Message level data
- LLM call level data

Must include warning:

> Do not treat interacting participants as independent observations. Players in the same group influence each other.

Completion standard:

- A user can load sample data, reconstruct group outcomes, and create basic plots.

## `docs/` Requirements

Purpose: Conceptual documentation.

Required files:

- `01_what_is_multiplayer_experiment.md`
- `02_design_framework.md`
- `03_human_only_experiments.md`
- `04_llm_only_simulations.md`
- `05_mixed_human_llm_experiments.md`
- `06_empirica_for_psychologists.md`
- `07_data_structure.md`
- `08_common_pitfalls.md`
- `09_reproducibility.md`
- `10_deployment_and_recruitment.md`
- `11_amp_ps_paper_outline.md`

### Required Topics

`01_what_is_multiplayer_experiment.md` must explain traditional individual experiments, multiplayer experiments, interaction, emergent group outcomes, and examples from psychology and behavioral science.

`02_design_framework.md` must explain Agents, Actions, Information, Interaction, and Outcomes. Use this as the main framework for the whole tutorial.

`03_human_only_experiments.md` must explain when to use human participants and what Empirica handles: synchronization, lobby, rounds, stages, and data export.

`04_llm_only_simulations.md` must explain when to use LLM agents, what LLM simulations can and cannot tell us, prompt design, model choice, reproducibility, cost, and logging.

`05_mixed_human_llm_experiments.md` must explain when to mix humans and LLMs, disclosure issues, agent identity, timing, fair comparison, and shared observation and action schema.

`06_empirica_for_psychologists.md` must explain Empirica concepts without too much engineering detail: game, player, round, stage, treatment, lobby, admin panel, and export.

`07_data_structure.md` must explain why multiplayer data are nested, why player round data are not independent, how to reconstruct groups, and how to analyze group level outcomes.

`08_common_pitfalls.md` must include: building a multiplayer interface without theoretical interaction; changing UI but not information structure; treating participants as independent observations; hard coding game parameters inside components; hard coding prompts inside logic; not logging prompts and raw responses; only testing with one browser window; ignoring dropout; making the first tutorial exercise too hard.

`09_reproducibility.md` must include: record config, prompts, model name, model parameters, raw LLM output, parsed action, code version, and random seed when possible.

`10_deployment_and_recruitment.md` must include: local pilot, online deployment, participant recruitment, group size constraints, dropout, timing, payment, and backup plan.

`11_amp_ps_paper_outline.md` must outline a future paper: introduction, why multiplayer experiments matter, design framework, human only experiments, LLM only simulations, mixed human and LLM experiments, case studies, data analysis, best practices, and open materials.

Completion standard:

- Docs should read like a practical methodological guide for psychologists.

## `assets/` Requirements

Purpose: Store visual and non-code materials.

Required folders:

- `images/diagrams`
- `images/screenshots`
- `videos`
- `templates`

Required assets:

- `design_worksheet.pdf`
- `design_worksheet.docx`
- `minimal_experiment_demo.mp4`
- `public_goods_demo.mp4`
- `llm_agent_demo.mp4`
- `mixed_human_llm_demo.mp4`

Completion standard:

- Tutorial participants can follow along even when code setup fails.

## `external_links/` Requirements

Purpose: Curated resources.

Required files:

- `empirica_docs.md`
- `empirica_examples.md`
- `multiplayer_experiment_readings.md`
- `public_goods_readings.md`
- `social_learning_readings.md`
- `human_ai_experiment_readings.md`
- `llm_agent_tools.md`

Each link entry should include:

- Title
- Short description
- Why it is useful
- Suggested audience

Completion standard:

- Participants can continue learning after the tutorial.

## Minimum First Version

Do not try to finish everything first.

The first useful version should include:

- `README.md`
- `SETUP.md`
- `TUTORIAL_GUIDE.md`
- `REPO_MAP.md`
- `.env.example`
- `slides/scripts/full_3hour_script.md`
- `hands_on/exercise_01_run_minimal_experiment`
- `hands_on/exercise_02_modify_public_goods_game`
- `hands_on/exercise_04_run_llm_only_simulation`
- `hands_on/exercise_06_export_and_analyze_data`
- `engines/empirica/human_only/minimal_two_player_choice`
- `engines/empirica/human_only/public_goods`
- `engines/llm_simulation`
- `engines/mixed_human_llm`
- `shared/game_logic/public_goods`
- `shared/configs`
- `shared/prompts/public_goods`
- `shared/schemas`
- `components/pages`
- `components/widgets`
- `examples/human_only/00_minimal_two_player_choice`
- `examples/human_only/01_public_goods`
- `examples/llm_only/04_public_goods_llm_simulation`
- `examples/mixed_human_llm/06_mixed_public_goods`
- `analysis/sample_data`
- `analysis/notebooks/python`
- `analysis/notebooks/r`

## Suggested Build Order

1. Create documentation skeleton: `README.md`, `SETUP.md`, `TUTORIAL_GUIDE.md`, `REPO_MAP.md`, and folder README files.
2. Build minimal human only Empirica example: two players, one round, one decision, one feedback screen.
3. Build public goods game: group size, rounds, endowment, multiplier, feedback, payoff.
4. Extract shared game logic: public goods logic, action schema, observation schema, event log schema.
5. Build mock LLM simulation: no API key required, config controls agents and prompts, exports shared data.
6. Build mixed human and LLM public goods game: human agents through Empirica, LLM agents through mock model, same shared game logic, same output schema.
7. Build analysis: sample data, Python notebook, R notebook, figures.
8. Polish tutorial materials: slides, scripts, screenshots, demo videos, troubleshooting.

## Implementation Guidance for Codex and Collaborators

For the first pass, create documentation standards and folder README files. Do not implement complex experiment code immediately.

Public documentation should emphasize this architecture:

- Game logic is shared.
- Empirica is the human experiment engine.
- LLM simulation is a separate engine.
- Mixed human LLM experiments use a bridge.
- Prompts and models are configurable.
- Analysis uses shared data schemas.
