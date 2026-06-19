# 00 Minimal Two-Player Choice

This example points to the smallest runnable human-only experiment in the repository.

## Research Question

How does a multiplayer experiment differ from a single participant response?

## Experiment Design

- Two human players
- One round
- One decision
- One feedback page
- Outcome: whether both players made the same choice

## How To Run

The runnable implementation lives in:

```text
engines/empirica/human_only/minimal_two_player_choice/
```

Run:

```bash
cd engines/empirica/human_only/minimal_two_player_choice
npm run install:all
npm run dev
```

## What Files To Modify

- `server/src/callbacks.js`: round and stage structure
- `client/src/Game.jsx`: decision and feedback display
- `.empirica/treatments.yaml`: player count treatment

## Expected Output

Both participants choose Option A or Option B. The feedback page shows each participant's own choice, the other participant's choice, and the group outcome.

## Data Structure

The decision is stored on `player.round.choice`. The computed partner choice and group outcome are stored on player round attributes during the decision stage end callback.

## Connection To Tutorial Exercise

Use this example with:

```text
hands_on/exercise_01_run_minimal_experiment/
```

