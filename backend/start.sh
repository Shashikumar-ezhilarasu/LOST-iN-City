#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# LOST-iN-City  —  Backend Start Script
# Loads env vars from .env, forces Java 21, then starts Spring Boot.
# ═══════════════════════════════════════════════════════════════════════════════

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Load environment variables from .env ──────────────────────────────────────
ENV_FILE="$SCRIPT_DIR/.env"
if [ -f "$ENV_FILE" ]; then
    set -o allexport
    source "$ENV_FILE"
    set +o allexport
    echo "✅ Loaded env from $ENV_FILE"
else
    echo "❌ Missing $ENV_FILE — copy .env.example to .env and fill in values"
    exit 1
fi

# ── Force Java 21 ─────────────────────────────────────────────────────────────
export JAVA_HOME=$(/usr/libexec/java_home -v 21 2>/dev/null) || {
    echo "❌ Java 21 not found. Install via: brew install --cask temurin@21"
    exit 1
}
export PATH="$JAVA_HOME/bin:$PATH"

echo "☕ Java:  $(java -version 2>&1 | head -1)"
echo "🌐 Port:  ${PORT:-8080}"
echo "📦 Kafka: ${KAFKA_BOOTSTRAP_SERVERS:-localhost:9092}"
echo "🍃 DB:    $(echo "$MONGODB_URI" | sed 's|://.*@|://***@|')"
echo ""

cd "$SCRIPT_DIR"
mvn spring-boot:run
