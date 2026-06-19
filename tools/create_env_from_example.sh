#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env ]]; then
  echo ".env already exists; leaving it unchanged."
  exit 0
fi

cp .env.example .env
echo "Created .env from .env.example."
