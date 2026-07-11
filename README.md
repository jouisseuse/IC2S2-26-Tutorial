# IC2S2 Tutorial: TogetherHire

This repository contains tutorial code for running the TogetherHire hiring experiment and a companion MultiLLM simulation.

TogetherHire is an Empirica experiment where participants act as hiring managers and learn from reward feedback across repeated decisions. MultiLLM provides a Python version of the same multi-agent bandit idea using LLM agents.

## What Is Here

- `code/TogetherHire/`: source files and Empirica configuration for the human participant experiment.
- `code/MultiLLM/`: Python code for running the LLM simulation.
- `materials/`: tutorial slides, figures, handouts, or notes.
- `setup_togetherhire.sh`: script that creates a fresh Empirica project and copies the TogetherHire code into it.

## Setup

### 1. Prerequisites

Install these before running the tutorial setup script:

- Git: [official Git downloads](https://git-scm.com/downloads)
- Node.js 20.12 or newer: [official Node.js downloads](https://nodejs.org/en/download)
- npm 10 or newer recommended: [official npm install guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

You can check your versions with:

```bash
git --version
node --version
npm --version
```

#### Windows

Empirica does not natively support Windows, but you can use it by installing WSL. See the official guide: [Empirica Windows WSL instructions](https://docs.empirica.ly/getting-started/setup/windows-wsl-instructions-new).

In PowerShell, run:

```powershell
wsl --install
```

Now you may be prompted to create a username and password. Make sure to write down your login credentials for the future.

Note: Copying and pasting may be disabled in the default settings of your WSL terminal. To remedy this, right-click the title bar and select `Properties -> Options -> Use Ctrl+Shift+C/V as Copy/Paste`.

After WSL is ready, open the Ubuntu terminal. Install Git, Node.js, and npm inside Ubuntu, then run the rest of the tutorial commands there. Do not run the Empirica commands in PowerShell.

### 2. Empirica Install

The official Empirica installer is:

```bash
curl -fsS https://install.empirica.dev | sh
```

This installs the Empirica CLI and runs `empirica setup`. It does not install Git, Node.js, or npm for you.

After installing Empirica, confirm:

```bash
empirica version
```

### 3. Setup Hiring Game

Run these commands in macOS Terminal, Linux terminal, or Ubuntu/WSL terminal:

```bash
git clone https://github.com/jouisseuse/IC2S2-26-Tutorial.git
cd IC2S2-26-Tutorial
bash setup_togetherhire.sh
```

The setup script will check your environment, create a fresh Empirica project at `../my-experiment`, copy the TogetherHire files, install client/server dependencies, and run a short startup test. It does not keep Empirica running.

Start the game with:

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

To run the MultiLLM simulation, install Python 3.10 or newer and pip first. Then run:

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

### Git is missing

Install Git first, then confirm:

```bash
git --version
```

### Node.js is too old

Install Node.js 20.12 or newer, then confirm:

```bash
node --version
```

### npm is missing or too old

Install or update npm, then confirm:

```bash
npm --version
```

### Empirica is missing

Install Empirica before running the setup script, then confirm:

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

### Missing LLM API key

Set `OPENAI_API_KEY`, or paste a temporary key into `DIRECT_API_KEY` for a local run. Never commit real keys.

## Dependency Policy

This repository does not commit generated local folders such as `node_modules/`, `dist/`, `__pycache__/`, or `.empirica/local/`.

Instead, it commits the source files and dependency manifests needed to rebuild the local environment:

- `package.json`
- `package-lock.json`
- `requirements.txt`
