# Logging

Standardized logging for human-only, LLM-only, and mixed experiments.

Implemented helpers:

- `event_logger.ts`: in-memory event records for game, round, action, payoff, and lifecycle events
- `llm_call_logger.ts`: LLM prompt, raw response, parsed action, latency, and model metadata records
- `data_exporter.ts`: JSONL and CSV serialization helpers

Engines can use these helpers directly or adapt their outputs to the schemas in `shared/schemas/`.

