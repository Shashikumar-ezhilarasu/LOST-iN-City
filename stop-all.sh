#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# LOST-iN-City  —  Full Stack Stopper
# ═══════════════════════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/backend/backend.pid"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}[STOP]${NC} Stopping LOST-iN-City stack..."

# Stop backend
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        kill "$PID" && echo -e "${GREEN}[OK]${NC}   Backend stopped (PID $PID)"
    fi
    rm -f "$PID_FILE"
fi

# Also sweep any stray mvn processes
pkill -f "LostCityApplication" 2>/dev/null && echo -e "${GREEN}[OK]${NC}   Cleaned up stray processes" || true

echo -e "${GREEN}[OK]${NC}   Done. Kafka container left running (use 'docker stop kafka' to stop it)."
