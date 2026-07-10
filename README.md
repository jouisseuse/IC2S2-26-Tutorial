# IC2S2 Tutorial: TogetherHire

This repository contains tutorial code for running the TogetherHire hiring experiment and a companion MultiLLM simulation.

TogetherHire is an Empirica experiment where participants act as hiring managers and learn from reward feedback across repeated decisions. MultiLLM provides a Python version of the same multi-agent bandit idea using LLM agents.

## What Is Here

- `code/TogetherHire/`: source files and Empirica configuration for the human participant experiment.
- `code/MultiLLM/`: Python code for running the LLM simulation.
- `materials/`: slides, figures, handouts, or notes for the tutorial.
- `setup_togetherhire.sh`: automated setup script for macOS, Linux, and WSL.
- `setup_togetherhire_windows.ps1`: Windows PowerShell setup script that installs/checks WSL Ubuntu and then runs the WSL setup.

## Requirements

For macOS, Linux, or an already working WSL terminal:

- Git
- Node.js 20.12 or newer
- npm 10 or newer recommended
- Python 3.10 or newer, only needed for the MultiLLM code
- pip, only needed for the MultiLLM code

For Windows PowerShell:

- Git for Windows, so you can clone this repository
- Windows 10/11 with WSL support

The setup scripts can install Empirica automatically if the `empirica` command is missing.

## Windows PowerShell Quick Start

Do not run `curl ... | sh` directly in Windows PowerShell or Command Prompt. That command expects a Unix-like shell, and Empirica is not currently supported as a native Windows install.

Instead, clone this repo in PowerShell:

```powershell
git clone --filter=blob:none --sparse https://github.com/jouisseuse/IC2S2-26-Tutorial.git
cd IC2S2-26-Tutorial
git sparse-checkout set code materials
```

Then run the Windows setup script:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup_togetherhire_windows.ps1
```

What it does:

1. Checks whether WSL is available.
2. If WSL Ubuntu is missing, tries to run `wsl --install -d Ubuntu`.
3. If Windows asks for a restart or Ubuntu asks for username/password setup, finish that and rerun the same PowerShell command.
4. Once WSL is ready, clones this repo inside the WSL home directory.
5. Runs `setup_togetherhire.sh` inside WSL.
6. Prints the command to start the game.

After setup finishes, open Ubuntu/WSL and run:

```bash
cd ~/my-experiment
empirica
```

## macOS, Linux, Or WSL Quick Start

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

After setup finishes, run:

```bash
cd ../my-experiment
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

Skip the short startup test on macOS/Linux/WSL:

```bash
RUN_STARTUP_TEST=0 bash setup_togetherhire.sh
```

Skip the short startup test from Windows PowerShell:

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

Run it inside Ubuntu/WSL, not PowerShell or Command Prompt. From PowerShell, use the wrapper instead:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup_togetherhire_windows.ps1
```

### WSL installation starts but setup does not continue

This is expected on first-time Windows setup. Restart Windows if prompted, open Ubuntu once, finish the username/password setup, then rerun:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup_togetherhire_windows.ps1
```

### Node.js is too old

Install Node.js 20.12 or newer inside macOS, Linux, or WSL. `@empirica/core` requires Node.js `>=20.12.0`.

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
