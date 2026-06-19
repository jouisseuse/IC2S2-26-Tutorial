# Social Learning Revise Prompt

Revise your estimate after seeing social information.

Previous own estimate: {{previous_own_estimate}}
Previous group average: {{previous_group_average}}
Private signal: {{private_signal}}
Round: {{round}}

Return JSON only:

```json
{
  "action_type": "estimate",
  "estimate": 0,
  "confidence": 0.5
}
```

