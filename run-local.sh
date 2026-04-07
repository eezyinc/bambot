#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 3 ]; then
  echo "Usage: $0 <BAMBOOHR_KEY> <BAMBOOHR_SUBDOMAIN> <SLACK_WEBHOOK_URL>"
  echo ""
  echo "Example: $0 abc123 mycompany https://hooks.slack.com/services/T00/B00/xxx"
  exit 1
fi

export BAMBOOHR_KEY="$1"
export BAMBOOHR_SUBDOMAIN="$2"
export SLACK_WEBHOOK_URL="$3"

npx ts-node -O '{"module":"commonjs"}' -e "require('./src/handler').handle().then((r: any) => console.log(r)).catch((e: any) => { console.error(e); process.exit(1) })"
