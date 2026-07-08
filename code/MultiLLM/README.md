# MultiLLM

This folder contains the Python LLM simulation for the hiring multi-agent bandit tutorial.

Install dependencies from this folder:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Set an API key before running:

```bash
export OPENAI_API_KEY="your-api-key"
export OPENAI_BASE_URL="https://api.openai.com/v1"
python mamab_llm.py
```

Do not commit real API keys.
