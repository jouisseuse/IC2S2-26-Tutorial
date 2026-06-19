# Schemas

Standardize data across human-only, LLM-only, and mixed experiments.

Core fields:

- `game_id`
- `group_id`
- `round`
- `stage`
- `actor_id`
- `actor_type`
- `action`
- `observation`
- `payoff`
- `treatment`
- `timestamp`

LLM-specific fields:

- `model`
- `prompt_id`
- `system_prompt`
- `user_prompt`
- `raw_response`
- `parsed_action`
- `latency_ms`
- `temperature`
- `max_tokens`

TODO:

- [ ] Define shared player schema
- [ ] Define shared action schema
- [ ] Define shared event log schema
- [ ] Define LLM call schema
- [ ] Ensure all engines export compatible data

