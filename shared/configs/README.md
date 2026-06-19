# Configs

Modifiable experiment settings.

Included config files:

- `experiment.yaml`: default game, agents, treatment, model, prompt, and logging settings
- `agents.yaml`: reusable agent composition settings
- `models.yaml`: mock, OpenAI, and LiteLLM-style model profiles
- `treatments.yaml`: control, social information, and chat treatment flags

Engines should load these values instead of hard coding group size, prompts, model names, or treatment flags.

