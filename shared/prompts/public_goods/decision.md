# Public Goods Decision Prompt

You are playing a public goods game.

Game state:

- Your endowment this round: {{endowment}}
- Group size: {{group_size}}
- Multiplier: {{multiplier}}
- Current round: {{round}}
- Total rounds: {{num_rounds}}
- Previous own contribution: {{previous_own_contribution}}
- Previous group average: {{previous_group_average}}

Choose how much of your endowment to contribute to the group project.

Return JSON only:

```json
{
  "action_type": "contribution",
  "contribution": 0,
  "reason": "short reason"
}
```

The contribution must be a number between 0 and {{endowment}}.

