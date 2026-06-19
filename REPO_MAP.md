# Repository Map

## Root

- `README.md`: Repository overview and conceptual positioning
- `SETUP.md`: Installation and first-run instructions
- `TUTORIAL_GUIDE.md`: Three-hour tutorial flow
- `REPO_MAP.md`: Directory guide
- `.env.example`: Environment variable template
- `CITATION.cff`: Citation metadata placeholder
- `LICENSE`: License placeholder

## Main Directories

- `slides/`: Tutorial slides, scripts, figures, and speaker notes
- `hands_on/`: Guided live exercises
- `engines/`: Experiment runners for human-only, LLM-only, and mixed experiments
- `shared/`: Engine-independent game logic, schemas, configs, prompts, and logging
- `components/`: Reusable Empirica UI components
- `examples/`: Complete examples users can copy and modify
- `analysis/`: Scripts, notebooks, and sample data
- `docs/`: Conceptual documentation
- `assets/`: Images, videos, diagrams, and worksheets
- `external_links/`: Curated references and official resources

## Architecture

Game logic defines rules and payoffs. Engines decide where the experiment runs. Agents can be human, LLM, scripted, or random. Models and prompts are separate from game logic. Analysis reconstructs individual, group, and game-level outcomes.

