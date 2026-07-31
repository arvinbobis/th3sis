#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/Users/arvinbobis/Programs/thesis-builder"
cd "$PROJECT_DIR"

echo "[$(date)] Starting weekly /radar sweep"

claude -p "/radar" \
  --allowedTools "Read Write Edit Bash Grep Glob" \
  --max-budget-usd 5 \
  2>&1 | tee -a logs/weekly-radar.log

echo "[$(date)] Weekly /radar sweep done"
