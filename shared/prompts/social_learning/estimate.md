# Social Learning Estimate Prompt

Make an estimate based on your private information.

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

`confidence` must be between 0 and 1.

