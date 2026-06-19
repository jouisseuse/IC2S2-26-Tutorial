# Setup Backup Plan

Use this file if local setup breaks before or during the tutorial.

The goal is to keep learning the design framework even if a laptop cannot run every example.

## If Installation Fails

Use the repository as reading material and follow the instructor demo.

Fallback options:

- Pair with another participant.
- Use screenshots in `assets/images/screenshots/`.
- Use sample exported data in `analysis/sample_data/`.
- Continue with the worksheet in `hands_on/exercise_07_design_your_own_experiment/`.

## If Empirica Does Not Run

Try the minimal checks:

```bash
node --version
npm --version
npm install
```

If the Empirica example still does not run:

- Watch the instructor demo.
- Use screenshots of the admin panel and participant windows.
- Focus on the concepts: agents, actions, information, interaction, outcomes.

## If LLM API Is Unavailable

Use mock LLM agents.

The tutorial should not require real API keys for the basic exercises.

Check `.env`:

```bash
USE_MOCK_MODEL=true
LOG_LLM_CALLS=true
```

## If Participant Windows Do Not Connect

Try:

- Refresh both participant windows.
- Open the second window in an incognito or private browser window.
- Check that both windows use the same local server URL.
- Restart the local server if needed.

If this still fails, pair with another participant or follow the instructor demo.

## If Time Is Short

Skip setup debugging and use the prepared materials:

- Screenshots
- Sample data
- Instructor demo
- Exercise discussion questions
- Design worksheet

## Use Sample Data Instead

If no local experiment runs, continue with analysis using sample data:

```text
analysis/sample_data/
```

The analysis exercises should teach how to reconstruct player round, group round, and game level outcomes even when the live experiment cannot run locally.

## Completion Standard

The tutorial should continue even if many participants have setup problems.
