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

Implemented schemas:

- `player.schema.json`
- `game.schema.json`
- `action.schema.json`
- `observation.schema.json`
- `event_log.schema.json`
- `llm_call.schema.json`
- `payoff.schema.json`

All engines should export records that match these field names whenever possible.

