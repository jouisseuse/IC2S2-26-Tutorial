# Mixed Social Learning

This folder is reserved for the Empirica-facing mixed social learning example.

The planned flow is:

1. Human participants submit estimates through Empirica.
2. LLM agents receive the same observation schema and submit estimates through
   the bridge.
3. The shared social learning logic computes group averages and error.
4. Exports keep human and LLM actions in one event log.

The first runnable version should use mock LLM agents by default.
