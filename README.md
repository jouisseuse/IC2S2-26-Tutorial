# IC2S2 Tutorial: TogetherHire

This repository contains tutorial code for running the TogetherHire hiring experiment and a companion MultiLLM simulation.

TogetherHire is an Empirica experiment where participants act as hiring managers and learn from reward feedback across repeated decisions. MultiLLM provides a Python version of the same multi-agent bandit idea using LLM agents.

## What Is Here

- `code/TogetherHire/`: source files and Empirica configuration for the human participant experiment.
- `code/MultiLLM/`: Python code for running the LLM simulation.
- `materials/`: slides, figures, handouts, or notes for the tutorial.
- `setup_togetherhire.sh`: setup script for macOS, Linux, and Ubuntu/WSL.

## Setup Overview

The setup has three steps:

1. Prepare a Unix-like environment with Git, Node.js, npm, and Empirica.
2. Clone this repository and run `setup_togetherhire.sh`.
3. Start the Empirica game with `empirica`.

Windows users should use Ubuntu through WSL. After Ubuntu/WSL is open, the commands are the same as macOS and Linux.

## Step 1: Prepare Your Environment

### Windows

Empirica does not natively support Windows, but you can use it by installing WSL. See the official guide: [Empirica Windows WSL instructions](https://docs.empirica.ly/getting-started/setup/windows-wsl-instructions-new).

In PowerShell, run:

```powershell
wsl --install
```

You may be prompted to create a username and password. Make sure to write down your login credentials for the future.

Note: Copying and pasting may be disabled in the default settings of your WSL terminal. To remedy this, right-click the title bar and select `Properties -> Options -> Use Ctrl+Shift+C/V as Copy/Paste`.

After WSL is ready, do all tutorial setup commands inside the Ubuntu terminal, not PowerShell. Inside Ubuntu, install or confirm these tools:

- Git
- Node.js 20.12 or newer
- npm 10 or newer recommended
- Empirica

### macOS Or Linux

Install or confirm these tools in your normal terminal:

- Git
- Node.js 20.12 or newer
- npm 10 or newer recommended
- Empirica

### Optional Python Tools

For the MultiLLM simulation, also install:

- Python 3.10 or newer
- pip

## Step 2: Clone The Repo And Run Setup

Run these commands in macOS Terminal, Linux terminal, or Ubuntu/WSL terminal:

```bash
git clone --filter=blob:none --sparse https://github.com/jouisseuse/IC2S2-26-Tutorial.git
cd IC2S2-26-Tutorial
git sparse-checkout set code materials
bash setup_togetherhire.sh
```

The setup script will:

1. Check your operating system.
2. Check Node.js and npm.
3. Check Empirica.
4. Create a fresh Empirica project at `../my-experiment`.
5. Copy the TogetherHire client, server, and Empirica config files.
6. Run `npm install` in both `client` and `server`.
7. Briefly start Empirica to confirm the app boots.
8. Stop the test server and print the command to start the game.

## Step 3: Start The Game

After setup finishes, run:

```bash
cd ../my-experiment
empirica
```

Empirica will print local Player and Admin URLs. For a quick local test, open two participant windows so the experiment can form a group.

## Script Options

Use a different project folder:

```bash
bash setup_togetherhire.sh ../my-togetherhire-test
```

Skip the short startup test:

```bash
RUN_STARTUP_TEST=0 bash setup_togetherhire.sh
```

The script stops if the target project folder already exists. This avoids overwriting your existing work.

## MultiLLM Setup

The setup script only prepares and tests the Empirica experiment.

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

Run the Empirica installer inside Ubuntu/WSL, not PowerShell or Command Prompt.

### WSL is not ready

Install and initialize Ubuntu/WSL first. Open Ubuntu once and finish the username/password setup. Then run the tutorial commands inside Ubuntu.

### Node.js is too old

Install Node.js 20.12 or newer inside macOS, Linux, or Ubuntu/WSL. `@empirica/core` requires Node.js `>=20.12.0`.

### Empirica is missing

Install Empirica inside macOS, Linux, or Ubuntu/WSL before running the setup script. Then confirm:

```bash
empirica version
```

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
