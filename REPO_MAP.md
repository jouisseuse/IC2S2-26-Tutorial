# Repository Map

This file explains where different kinds of material belong.

## Root Files

- `README.md`: Quick overview for visitors
- `SETUP.md`: Local setup instructions
- `SETUP_BACKUP.md`: Fallback plan when setup fails
- `TUTORIAL_GUIDE.md`: Three-hour tutorial path
- `REPO_MAP.md`: Directory guide
- `CONTENT_REQUIREMENTS.md`: Content standards and completion criteria
- `.env.example`: Environment variable template without secrets
- `CITATION.cff`: Citation metadata
- `LICENSE`: License information

## `slides/`

Contains tutorial slides, speaker scripts, figures, and speaker notes.

Use it when preparing or teaching the workshop.

Do not put runnable code, raw data, or analysis notebooks here.

## `hands_on/`

Contains guided live exercises.

Use it when participants need step by step instructions, starter files, solution files, expected output, screenshots, and discussion questions.

Do not put reusable implementation only here. Reusable code belongs in `engines/`, `shared/`, or `examples/`.

## `engines/`

Contains the systems that run experiments.

- `engines/empirica/`: Human participant experiments
- `engines/llm_simulation/`: LLM only command-line simulations
- `engines/mixed_human_llm/`: Bridge between humans and LLM agents

Use it when changing how an experiment runs.

Do not put general game rules here if they can be shared. Put shared rules in `shared/game_logic/`.

## `shared/`

Contains the reusable core.

Use it for game logic, schemas, configs, prompts, logging, and utilities that should work across human-only, LLM-only, and mixed experiments.

Do not put Empirica UI pages, participant-facing components, or one-off exercise instructions here.

## `components/`

Contains reusable Empirica UI components.

Use it for pages, layouts, widgets, forms, and feedback views.

Do not put game rules, prompts, model calls, payoff calculations, or analysis scripts here.

## `examples/`

Contains complete examples users can copy and modify.

Use it when creating a runnable example with a research question, configs, sample data, screenshots, and analysis link.

Do not put workshop-only instructions here. Those belong in `hands_on/`.

## `analysis/`

Contains scripts, notebooks, sample data, and figures for analysis.

Use it to clean exports, reconstruct player round and group round data, merge LLM logs, compute outcomes, and plot results.

Do not put experiment runtime code, UI components, or prompts here.

## `docs/`

Contains conceptual documentation.

Use it to explain the design framework, experiment modes, data structure, pitfalls, reproducibility, deployment, and future paper outline.

Do not put runnable code or raw data here.

## `assets/`

Contains visual and non-code materials.

Use it for diagrams, screenshots, videos, and worksheet templates.

Do not put source code, logs, or notebooks here.

## `external_links/`

Contains curated references and official resources.

Use it for links to Empirica docs, example repositories, papers, and LLM agent tools.

Do not copy full copyrighted papers or put unannotated link dumps here.

## `tools/`

Contains small repository-level helper commands.

Use it to check the environment, check required files, copy `.env.example`, or scan for accidentally committed API keys.

Do not put experiment runners or data analysis here. LLM simulation runners belong in `engines/llm_simulation/runner/`; data analysis scripts belong in `analysis/scripts/`.

## Architecture Summary

Game logic defines the rules. Engines decide where the experiment runs. Agents can be human, LLM, scripted, or random. Models and prompts are configurable. Analysis reconstructs individual and group level outcomes from shared schemas.
