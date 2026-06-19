# Mixed Human-LLM Engine

Bridge human participants and LLM agents.

Implemented bridge helpers:

- `agent_scheduler.ts`: schedules and groups actor types
- `human_action_collector.ts`: converts human UI decisions to the shared action schema
- `llm_action_collector.ts`: converts LLM agent decisions to the shared action schema
- `action_merger.ts`: sorts and groups mixed action records
- `mixed_group_runner.ts`: runs LLM turns alongside already-collected human actions
- `mixed_data_exporter.ts`: exports mixed action records as CSV and JSONL

The bridge keeps human and LLM actions in the same shape so analysis can compare actor types directly.
