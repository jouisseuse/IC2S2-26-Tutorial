# LLM Simulation Engine

Runs the same games as LLM-only simulations.

Implemented pieces:

- `runner/run_mock_simulation.ts`: default mock public goods simulation
- `runner/run_public_goods_simulation.ts`: public goods simulation entrypoint
- `runner/run_social_learning_simulation.ts`: social learning simulation entrypoint
- `runner/run_batch_simulation.ts`: repeated mock public goods simulations
- `agents/`: LLM, scripted, and random agents
- `model_adapters/`: mock, OpenAI, Anthropic, and LiteLLM-compatible clients

Run the mock simulation:

```bash
npm install
npm run simulate:mock
```

Outputs are written to `engines/llm_simulation/outputs/` as CSV and JSONL.
