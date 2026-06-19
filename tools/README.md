# Tools

Small repository-level helper commands.

These tools are for setup and repository hygiene. They are not experiment logic and they are not data analysis scripts.

- `check_environment.sh`: check local command versions
- `check_required_files.py`: check important skeleton files
- `check_no_api_keys.sh`: scan tracked text for likely committed secrets
- `create_env_from_example.sh`: create `.env` from `.env.example`

Data analysis belongs in `analysis/scripts/`. Experiment runners belong in `engines/`.
