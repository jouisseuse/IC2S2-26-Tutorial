# Minimal Two-Player Choice

This is the smallest human-only Empirica example in the repository.

It has:

- Two human players
- One round
- One decision stage
- One feedback stage

The experiment asks each participant to choose Option A or Option B. The feedback page shows whether the two participants made the same choice.

## Why This Example Exists

This example teaches the basic multiplayer flow before introducing public goods games, social information, LLM agents, or mixed human-LLM groups.

## Run It

From this folder:

```bash
npm run install:all
npm run dev
```

The local Empirica admin credentials in this tutorial example are:

- Username: `admin`
- Password: `adminadmin`

After Empirica starts:

1. Open the admin panel from the local URL printed by Empirica.
2. Create a batch using the `Two Players` treatment.
3. Open two participant windows.
4. Choose Option A or Option B in each participant window.
5. View the feedback page.

## What You Can Change

- Stage duration in `server/src/callbacks.js`
- Treatment player count in `.empirica/treatments.yaml`
- Button labels in `client/src/Game.jsx`
- Page styling in `client/src/style.css`

## What Not To Add Here

Do not add LLM logic here. This example is intentionally human only.

Do not add public goods payoff logic here. That belongs in the public goods example and later in `shared/game_logic/public_goods/`.

## Files

- `.empirica/`: Empirica local config, lobby config, and treatment config
- `client/`: Participant-facing React UI
- `server/`: Empirica callbacks that create the round and compute feedback
- `configs/`: Placeholder for future example-level configs
- `sample_data/`: Placeholder for exported data
- `screenshots/`: Placeholder for tutorial screenshots

## Expected Output

Each participant should see:

- A decision page with two buttons
- A waiting message after submitting
- A feedback page showing their choice, the other participant's choice, and the group outcome
