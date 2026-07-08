# Setup

These instructions are written for tutorial participants. They assume you can copy and paste commands into a terminal, but do not assume prior Empirica experience.

## Requirements

Install these before the tutorial:

- Git
- Node.js 20 or newer
- npm 10 or newer
- Empirica
- Python 3.10 or newer
- pip

This code was prepared with Node.js `20.11.1`, npm `10.2.4`, and `@empirica/core` `1.12.4`.

## 1. Clone Only The Useful Repo Content

```bash
git clone --filter=blob:none --sparse https://github.com/jouisseuse/multiplayer-experiment-framework.git
cd multiplayer-experiment-framework
git sparse-checkout set code materials README.md SETUP.md .env.example
```

If you already cloned the full repository, you can skip this step.

## 2. Install Empirica

The official Empirica quick start uses this installer:

```bash
curl -fsS https://install.empirica.dev | sh
```

Confirm Empirica works:

```bash
empirica version
```

If this command prints a version number, Empirica is available from your terminal.

## 3. Create A Fresh Empirica Project

Create a new project outside this repository:

```bash
cd ..
empirica create my-experiment
cd my-experiment
```

The next step replaces the generated example files with TogetherHire files.

## 4. Replace The Empirica Files

Set the path to this repository:

```bash
REPO_PATH="../multiplayer-experiment-framework"
```

Replace the client files:

```bash
rm -rf client/src
cp -R "$REPO_PATH/code/TogetherHire/client/src" client/src
cp "$REPO_PATH/code/TogetherHire/client/index.html" client/index.html
cp "$REPO_PATH/code/TogetherHire/client/jsconfig.json" client/jsconfig.json
cp "$REPO_PATH/code/TogetherHire/client/package.json" client/package.json
cp "$REPO_PATH/code/TogetherHire/client/package-lock.json" client/package-lock.json
cp "$REPO_PATH/code/TogetherHire/client/uno.config.ts" client/uno.config.ts
cp "$REPO_PATH/code/TogetherHire/client/vite.config.js" client/vite.config.js
```

Replace the server files:

```bash
rm -rf server/src
cp -R "$REPO_PATH/code/TogetherHire/server/src" server/src
cp "$REPO_PATH/code/TogetherHire/server/jsconfig.json" server/jsconfig.json
cp "$REPO_PATH/code/TogetherHire/server/package.json" server/package.json
cp "$REPO_PATH/code/TogetherHire/server/package-lock.json" server/package-lock.json
```

Replace the Empirica treatment and lobby settings:

```bash
cp "$REPO_PATH/code/TogetherHire/.empirica/treatments.yaml" .empirica/treatments.yaml
cp "$REPO_PATH/code/TogetherHire/.empirica/lobbies.yaml" .empirica/lobbies.yaml
```

Do not replace `.empirica/local/`, `.empirica/id`, or `.empirica/release`. Those are local files created by Empirica.

## 5. Install Dependencies

Install the client dependencies:

```bash
cd client
npm install
```

Install the server dependencies:

```bash
cd ../server
npm install
```

Return to the Empirica project root:

```bash
cd ..
```

## 6. Run The TogetherHire Experiment

From the root of `my-experiment`, run:

```bash
empirica
```

Open the local participant and admin links printed by Empirica.

For a quick local test, open two participant windows so the experiment can form a group.

## 7. Run The MultiLLM Simulation

From the folder that contains `multiplayer-experiment-framework`:

```bash
cd multiplayer-experiment-framework/code/MultiLLM
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Set an API key:

```bash
export OPENAI_API_KEY="your-api-key"
export OPENAI_BASE_URL="https://api.openai.com/v1"
```

Then run:

```bash
python mamab_llm.py
```

For a quick local tutorial edit, you can also paste a temporary key into `DIRECT_API_KEY` near the top of `mamab_llm.py`. Do not commit real API keys.

## Troubleshooting

### `vite: not found`

Run `npm install` inside the `client` folder.

```bash
cd client
npm install
```

### `esbuild: not found`

Run `npm install` inside the `server` folder.

```bash
cd server
npm install
```

### `empirica: command not found`

Empirica is not installed, or it is not on your terminal `PATH`. Reinstall Empirica and confirm:

```bash
empirica version
```

### Port already in use

Stop the old Empirica process with `Ctrl+C`, then run `empirica` again.

### Missing LLM API key

Set `OPENAI_API_KEY`, or paste a temporary key into `DIRECT_API_KEY` for a local run. Never commit real keys.

### Model call failed

Check that your API key, base URL, model name, and internet connection are working.
