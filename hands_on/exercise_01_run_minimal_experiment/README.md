# Exercise 01: Run Minimal Experiment

Goal: Understand the basic multiplayer experiment flow.

## Time Needed

25 minutes

## Experiment

- 2 players
- 1 round
- 1 decision
- 1 feedback page

## Files To Open

- `engines/empirica/human_only/minimal_two_player_choice/`
- `examples/human_only/00_minimal_two_player_choice/`

## Step By Step

1. Open a terminal in `engines/empirica/human_only/minimal_two_player_choice/`.
2. Run `npm run install:all`.
3. Run `npm run dev`.
4. Open the Empirica admin panel.
5. Log in with username `admin` and password `adminadmin`.
6. Create a batch with the `Two Players` treatment.
7. Open two participant windows.
8. Choose Option A or Option B as each participant.
9. Wait for the feedback page.
10. Confirm that the feedback page shows both choices and the group outcome.

## Expected Output

Each participant should see one decision page and one feedback page.

## Common Errors

- Only one participant window is open, so the game waits in the lobby.
- Both participant windows use the same participant key.
- The server is not running.
- The local port is already in use.

## Discussion Questions

See [discussion_questions.md](discussion_questions.md).
