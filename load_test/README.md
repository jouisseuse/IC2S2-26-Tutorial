# TogetherHire Load Test

This folder contains a small Playwright-based load test for the TogetherHire Empirica game.

The goal is not to find a universal maximum user count. Capacity depends on the experiment logic, write frequency, group size, broadcast volume, server CPU/memory, and how many games are active at once. Use this tool to run progressive checks before a tutorial or study.

## Install

From this folder:

```bash
npm install
npx playwright install chromium
# Linux/WSL only, if Chromium fails to launch:
npx playwright install-deps chromium
```

## Start The Game

In a separate terminal, start the Empirica game:

```bash
cd ../my-experiment
empirica
```

Copy the player URL printed by Empirica. If Empirica prints a URL with a participant key, use that exact URL as `BASE_URL`.

## Automated Capacity Estimate

After the game is set up in `../my-experiment`, this command starts Empirica, runs progressive browser load tests, stops at the first failing level, and prints an estimated capacity.

```bash
npm run capacity
```

Default capacity levels are `25,50,100,200`, so the default upper bound is 200 users. If all levels pass, the report says capacity is at least 200 under this scenario.

Customize the upper bound or levels:

```bash
npm run capacity -- --max-users 100
npm run capacity -- --levels 10,25,50 --rounds 3
```

If Empirica is already running, use the Player URL and skip automatic server startup:

```bash
BASE_URL="http://localhost:3000" npm run capacity -- --start-server false
```

## Smoke Test

```bash
BASE_URL="http://localhost:3000" npm run smoke
```

## Manual Ramp Test

```bash
BASE_URL="http://localhost:3000" npm run ramp
```

You can also run custom settings:

```bash
BASE_URL="http://localhost:3000" node run_load_test.mjs --users 50 --rounds 3 --headless true
```

## What It Measures

The script records:

- users launched
- users completed
- failed users
- total elapsed time
- per-user elapsed time
- browser console errors
- page errors
- timeouts

Results are written to `load_test/results/` as JSON.

## Adapting This To Another Game

For a different Empirica game, update the load test in the same places where a real participant flow changes:

- `DEFAULT_SELECTORS` in `run_load_test.mjs`: consent button, start button, decision controls, submit button, and continue button.
- `playParticipant()` in `run_load_test.mjs`: the sequence of actions a participant should take.
- `fillAllocationIfPresent()` if your game does not use allocation inputs or uses a different input format.
- `--rounds`, `--levels`, and `--timeout-ms` for the expected number of decisions and realistic pacing.
- Success criteria such as `completedChoices` if your game has a different definition of completion.

The load test should mimic the main participant actions in your actual game. Do not add synthetic polling or heartbeat writes unless those are truly part of the experiment you want to stress test.

## What The JSON Records

The JSON files in `load_test/results/` record load-test metrics: user count, completed users, failed users, elapsed time, browser errors, and per-participant completion status.

They are not full Empirica data exports. During local runs, Empirica/Tajriba stores its own local state separately under the generated experiment folder, usually in `.empirica/local/tajriba.json`. Use the load-test JSON to evaluate capacity and reliability; use Empirica exports or Tajriba state for experiment data.

## Notes

This is a realistic browser load test, not a protocol-level benchmark. It intentionally simulates participant browsers clicking through the game. For very high concurrency, run this from a separate machine so the load generator does not compete with the Empirica server for CPU and memory.
