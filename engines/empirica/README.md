# Empirica Engine

Human participant experiments using Empirica.

This folder contains browser-based human experiment examples and small helper
utilities for assigning players, creating rounds and stages, loading configs,
and exporting participant data.

Current first-version contents:

- `human_only/minimal_two_player_choice/`: runnable two-player, one-round demo.
- `human_only/public_goods/`: placeholder for the next human-only game.
- `human_only/social_learning/`: placeholder for the next human-only game.
- `mixed_human_llm/`: Empirica-side folder for mixed experiments.
- `shared_empirica_utils/`: reusable TypeScript helpers.

Use this folder when the experiment needs real human participants, browser
windows, synchronization, a lobby, or the Empirica admin panel.

Do not put LLM-only runners or data analysis scripts here. LLM-only simulation
code belongs in `engines/llm_simulation/`; analysis belongs in
`analysis/scripts/`.
