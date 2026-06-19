# Game Logic

Defines game rules independent of Empirica or LLM APIs.

Each game logic module defines:

- Initial state
- Valid actions
- Observation shown to each agent
- State transition
- Payoff calculation
- Round update
- End condition

Implemented first-version modules:

- `public_goods/`: contribution, payoff, round update, and export helpers.
- `coordination/`: option choice, majority outcome, and payoff helpers.
- `social_learning/`: estimate collection, group average, and error helpers.
- `cleanup/`: simple collective-action cleanup game skeleton.

Who should use this:

Researchers and contributors who want to change the actual rules of a game.
Engines should import these functions instead of duplicating payoff or
transition logic.

What not to put here:

Do not put Empirica UI code, LLM prompts, model names, API calls, or analysis
scripts here. Those belong in `components/`, `shared/prompts/`,
`engines/llm_simulation/`, and `analysis/scripts/`.
