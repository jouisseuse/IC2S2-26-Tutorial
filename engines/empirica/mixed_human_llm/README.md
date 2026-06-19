# Mixed Human-LLM Empirica Examples

This folder is for Empirica experiments where some actors are human
participants and some actors are LLM agents.

Empirica should collect human actions through the browser. LLM actions should
come from the bridge code in `engines/mixed_human_llm/`, which keeps human and
LLM actions in the same shared schema.

Planned examples:

- `public_goods/`: two humans plus mock LLM agents in the same group.
- `social_learning/`: humans and LLM agents revising estimates over rounds.

Do not place model adapter implementations or LLM-only batch runners here.
Those belong in `engines/llm_simulation/`.
