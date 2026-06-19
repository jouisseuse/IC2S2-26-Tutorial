#!/usr/bin/env bash
set -euo pipefail

echo "Checking environment..."

if ! command -v git >/dev/null 2>&1; then
  echo "Missing git"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Missing node"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Missing npm"
  exit 1
fi

echo "git: $(git --version)"
echo "node: $(node --version)"
echo "npm: $(npm --version)"

if command -v empirica >/dev/null 2>&1; then
  echo "empirica: $(empirica version | head -1)"
else
  echo "empirica: not found; install Empirica before running human-only examples"
fi

echo "Environment check complete."
