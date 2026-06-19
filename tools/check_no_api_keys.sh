#!/usr/bin/env bash
set -euo pipefail

patterns=(
  'sk-[A-Za-z0-9_-]{20,}'
  'OPENAI_API_KEY=.+'
  'ANTHROPIC_API_KEY=.+'
  'GOOGLE_API_KEY=.+'
  'LITELLM_API_KEY=.+'
)

failed=0
for pattern in "${patterns[@]}"; do
  if git grep -n -E "$pattern" -- ':!*.placeholder' ':!.env.example' ':!tools/check_no_api_keys.sh' >/tmp/api_key_scan.txt; then
    echo "Potential secret pattern found: $pattern"
    cat /tmp/api_key_scan.txt
    failed=1
  fi
done

rm -f /tmp/api_key_scan.txt

if [[ "$failed" -ne 0 ]]; then
  echo "Potential API key detected."
  exit 1
fi

echo "No obvious API keys found in tracked files."
