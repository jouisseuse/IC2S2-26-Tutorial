# IC2S2 Tutorial: TogetherHire

This repository contains tutorial code for running the TogetherHire hiring experiment and a companion MultiLLM simulation.

TogetherHire is an Empirica experiment where participants act as hiring managers and learn from reward feedback across repeated decisions. MultiLLM provides a Python version of the same multi-agent bandit idea using LLM agents.

## What Is Here

- `code/TogetherHire/`: source files and Empirica configuration for the human participant experiment.
- `code/MultiLLM/`: Python code for running the LLM simulation.
- `materials/`: slides, figures, handouts, or notes for the tutorial.
- `setup_togetherhire.sh`: automated setup script for macOS, Linux, and WSL.
- `setup_togetherhire_windows.ps1`: Windows PowerShell wrapper that runs the setup inside WSL.

## Requirements

Install these before running the tutorial setup:

- Git
- Node.js 20.12 or newer, for macOS/Linux/WSL setup
- npm 10 or newer recommended
- Python 3.10 or newer, only needed for the MultiLLM code
- pip, only needed for the MultiLLM code

The setup scripts can install Empirica automatically if the `empirica` command is missing.

## Windows Users

Do not run the Empirica installer directly in Windows PowerShell or Command Prompt. The command `curl ... | sh` expects a Unix-like shell, and Empirica is not currently supported as a native Windows install.

Use WSL 2 instead. In PowerShell, install WSL first:

```powershell
wsl --install
```

Restart if Windows asks you to, then finish the Ubuntu setup. After WSL is ready, use the Windows setup wrapper below.

## Quick Start On Windows PowerShell

Clone this repo in PowerShell:

```powershell
git clone --filter=blob:none --sparse https://github.com/jouisseuse/IC2S2-26-Tutorial.git
cd IC2S2-26-Tutorial
git sparse-checkout set code materials
```

Run the Windows wrapper:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup_togetherhire_windows.ps1
```

The wrapper will use WSL, clone the tutorial repo inside the WSL home directory, run the Linux setup script there, and print the command to start the game.

## Quick Start On macOS, Linux, Or WSL

Clone the tutorial repo:

```bash
git clone --filter=blob:none --sparse https://github.com/jouisseuse/IC2S2-26-Tutorial.git
cd IC2S2-26-Tutorial
git sparse-checkout set code materials
```

Run the automated setup:

```bash
bash setup_togetherhire.sh
```

The script will:

1. Check your operating system.
2. Check Node.js and npm.
3. Check or install Empirica.
4. Create a fresh Empirica project at `../my-experiment`.
5. Copy the TogetherHire client, server, and Empirica config files.
6. Run `npm install` in both `client` and `server`.
7. Briefly start Empirica to confirm the app boots.
8. Stop the test server and print the command to start the game.

## Start The Game

After setup finishes, run the command printed by the script.

For the default macOS/Linux/WSL setup, that is:

```bash
cd ../my-experiment
empirica
```

For the default Windows wrapper setup, open Ubuntu/WSL and run:

```bash
cd ~/my-experiment
empirica
```

Empirica will print local Player and Admin URLs. For a quick local test, open two participant windows so the experiment can form a group.

## Script Options

Use a different project folder on macOS/Linux/WSL:

```bash
bash setup_togetherhire.sh ../my-togetherhire-test
```

Use a different project folder from Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup_togetherhire_windows.ps1 -ProjectDir "~/my-togetherhire-test"
```

Skip the short startup test:

```bash
RUN_STARTUP_TEST=0 bash setup_togetherhire.sh
```

From Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup_togetherhire_windows.ps1 -SkipStartupTest
```

Disable automatic Empirica installation on macOS/Linux/WSL:

```bash
INSTALL_EMPIRICA=0 bash setup_togetherhire.sh
```

The scripts stop if the target project folder already exists. This avoids overwriting your existing work.

## MultiLLM Setup

The automated setup scripts only prepare and test the Empirica experiment.

To run the MultiLLM simulation:

```bash
cd code/MultiLLM
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY="your-api-key"
export OPENAI_BASE_URL="https://api.openai.com/v1"
python mamab_llm.py
```

For a quick local tutorial edit, you can also paste a temporary key into `DIRECT_API_KEY` near the top of `mamab_llm.py`. Do not commit real API keys.

## Troubleshooting

### `curl ... | sh` fails on Windows

Run it inside Ubuntu/WSL, not PowerShell or Command Prompt. In PowerShell, use:

```powershell
wsl --install
```

Then either open Ubuntu/WSL and use the macOS/Linux/WSL instructions, or run:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup_togetherhire_windows.ps1
```

### Node.js is too old

Install Node.js 20.12 or newer. `@empirica/core` requires Node.js `>=20.12.0`.

### Target folder already exists

Choose a new folder:

```bash
bash setup_togetherhire.sh ../my-experiment-2
```

### Startup test fails because the port is already in use

Stop the existing Empirica process with `Ctrl+C`, or skip the startup test:

```bash
RUN_STARTUP_TEST=0 bash setup_togetherhire.sh ../my-experiment-2
```

### `vite: not found`

The client dependencies were not installed. Re-run the script, or run:

```bash
cd ../my-experiment/client
npm install
```

### `esbuild: not found`

The server dependencies were not installed. Re-run the script, or run:

```bash
cd ../my-experiment/server
npm install
```

### `empirica: command not found`

Open a new terminal and try again. On Windows, open Ubuntu/WSL, not PowerShell or Command Prompt. If it still fails inside macOS, Linux, or WSL, reinstall Empirica:

```bash
curl -fsS https://install.empirica.dev | sh
```

### Port already in use when starting the game

Stop the old Empirica process with `Ctrl+C`, then run:

```bash
cd ../my-experiment
empirica
```

### Missing LLM API key

Set `OPENAI_API_KEY`, or paste a temporary key into `DIRECT_API_KEY` for a local run. Never commit real keys.

## Dependency Policy

This repository does not commit generated local folders such as `node_modules/`, `dist/`, `__pycache__/`, or `.empirica/local/`.

Instead, it commits the source files and dependency manifests needed to rebuild the local environment:

- `package.json`
- `package-lock.json`
- `requirements.txt`
