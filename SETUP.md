# Setup

This guide helps you prepare the repository for the tutorial. The first runnable examples are still being built, so some commands are placeholders until the minimal example is implemented.

## System Requirements

Recommended:

- Node.js 20 or newer
- npm 10 or newer
- Git
- A modern browser such as Chrome, Edge, or Firefox
- Optional for analysis: Python 3.10 or newer
- Optional for R notebooks: R and RStudio

## Clone the Repository

```bash
git clone https://github.com/jouisseuse/multiplayer-experiment-framework.git
cd multiplayer-experiment-framework
```

## Install Dependencies

After package files are added, install dependencies from the relevant example folder.

General placeholder:

```bash
npm install
```

For an Empirica example, use the example folder:

```bash
cd engines/empirica/human_only/minimal_two_player_choice
npm install
```

## Set Environment Variables

Copy the environment template:

```bash
cp .env.example .env
```

The tutorial should work with mock LLM agents by default. Real API keys are optional.

Do not commit `.env`.

## Run Human Only Empirica Example

Placeholder command for the minimal human-only experiment:

```bash
cd engines/empirica/human_only/minimal_two_player_choice
npm install
npm run dev
```

Expected result once implemented:

- Empirica starts locally.
- The admin panel opens or prints a local URL.
- You can open two participant windows.
- Each participant makes one decision.
- A feedback page appears.

## Run LLM Only Simulation with Mock Model

Placeholder command for the mock LLM simulation:

```bash
cd engines/llm_simulation
npm install
npm run simulate:mock
```

Expected result once implemented:

- The simulation runs without real API keys.
- Mock agents make decisions.
- Output is exported using the shared schema.

## Run Mixed Human and LLM Example

Placeholder command for the mixed experiment:

```bash
cd examples/mixed_human_llm/06_mixed_public_goods
npm install
npm run dev
```

Expected result once implemented:

- Human participants act through Empirica.
- LLM agents act through the model adapter.
- Both actor types are logged using the same event schema.

## Troubleshooting

### Node Version Error

Check your version:

```bash
node --version
npm --version
```

Use Node.js 20 or newer if possible.

### Empirica Command Not Found

Run `npm install` in the relevant Empirica example folder. If the command still fails, use the instructor demo or screenshots during the tutorial.

### Port Already in Use

Close other local servers or change the port if the example supports it.

### Cannot Open Admin Panel

Check the terminal output for the local URL. Make sure the server is still running.

### LLM API Key Missing

Use the mock model. The basic tutorial should not require paid API access.

### Model Call Failed

Switch to `USE_MOCK_MODEL=true` in `.env` and rerun the simulation.

### Data Export Not Found

Check the example README for the export location. If exports are not available, use sample data in `analysis/sample_data/`.

## Tutorial Backup Plan

If local setup fails, use [SETUP_BACKUP.md](SETUP_BACKUP.md). You can still follow the tutorial with screenshots, sample data, a mock simulation, or the instructor demo.
