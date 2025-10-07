#!/usr/bin/env bash
set -euo pipefail

# Starts the full dev environment using docker compose
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
ROOT_DIR=$(dirname "$SCRIPT_DIR")

cd "$ROOT_DIR"
docker compose up --build








