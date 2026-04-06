#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# LOST-iN-City  —  Full Stack Launcher
# Starts: Kafka (Docker) → Spring Boot backend
# ═══════════════════════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
LOG_FILE="$BACKEND_DIR/backend.log"
PID_FILE="$BACKEND_DIR/backend.pid"

# ── Colours ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     🗺️  LOST-iN-City  —  Starting Full Stack     ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# ── 1. Verify Java 21 ─────────────────────────────────────────────────────────
info "Setting Java 21..."
export JAVA_HOME=$(/usr/libexec/java_home -v 21 2>/dev/null) || error "Java 21 not found. Install via: brew install --cask temurin@21"
export PATH="$JAVA_HOME/bin:$PATH"
JAVA_VER=$(java -version 2>&1 | head -1)
success "Java: $JAVA_VER"

# ── 2. Ensure Docker is running ────────────────────────────────────────────────
info "Checking Docker..."
docker info > /dev/null 2>&1 || error "Docker is not running. Please start Docker Desktop."
success "Docker is running"

# ── 3. Start/verify Kafka ──────────────────────────────────────────────────────
KAFKA_RUNNING=$(docker ps --filter "name=kafka" --filter "status=running" -q 2>/dev/null)

if [ -n "$KAFKA_RUNNING" ]; then
    success "Kafka already running (container: kafka)"
else
    info "Starting Kafka via docker-compose..."
    if [ -f "$SCRIPT_DIR/docker-compose.yml" ]; then
        docker-compose -f "$SCRIPT_DIR/docker-compose.yml" up -d kafka zookeeper 2>&1
        info "Waiting for Kafka to be ready (15s)..."
        sleep 15
    else
        error "docker-compose.yml not found. Kafka must be running manually on localhost:9092"
    fi
fi

# ── 4. Verify Kafka topics exist ───────────────────────────────────────────────
info "Verifying Kafka topics..."
TOPICS=$(docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list 2>/dev/null || \
         docker exec lostcity-kafka kafka-topics --bootstrap-server localhost:9092 --list 2>/dev/null || echo "")

REQUIRED_TOPICS=("lost-item-reported" "found-item-posted" "claim-submitted" "claim-approved" "reward-transferred" "xp-coins-updated")
ALL_GOOD=true
for topic in "${REQUIRED_TOPICS[@]}"; do
    if echo "$TOPICS" | grep -q "^${topic}$"; then
        success "  ✓ $topic"
    else
        warn "  ✗ $topic (will be auto-created by Spring Boot)"
        ALL_GOOD=false
    fi
done

# ── 5. Kill any existing backend process ───────────────────────────────────────
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE" 2>/dev/null)
    if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
        info "Stopping existing backend (PID $OLD_PID)..."
        kill "$OLD_PID" 2>/dev/null
        sleep 2
    fi
fi

# ── 6. Start Spring Boot backend ───────────────────────────────────────────────
info "Starting Spring Boot backend..."
cd "$BACKEND_DIR"

if [ -f ".env" ]; then
    set -o allexport
    source .env
    set +o allexport
    info "Loaded environment variables from backend/.env"
else
    warn "backend/.env not found, using system environment variables"
fi

nohup mvn spring-boot:run >> "$LOG_FILE" 2>&1 &
BACKEND_PID=$!
echo "$BACKEND_PID" > "$PID_FILE"
info "Backend starting (PID=$BACKEND_PID), streaming log..."

# ── 7. Wait for Started signal ────────────────────────────────────────────────
MAX_WAIT=60
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    if grep -q "Started LostCityApplication" "$LOG_FILE" 2>/dev/null; then
        STARTUP_TIME=$(grep "Started LostCityApplication" "$LOG_FILE" | tail -1 | grep -oE "[0-9]+\.[0-9]+ seconds")
        break
    fi
    if grep -qi "APPLICATION FAILED\|BUILD FAILURE\|java.lang.Error" "$LOG_FILE" 2>/dev/null; then
        echo ""
        error "Backend failed to start! Check: tail -50 $LOG_FILE"
    fi
    sleep 1
    WAITED=$((WAITED + 1))
    printf "\r${CYAN}[INFO]${NC}  Waiting for Spring Boot... ${WAITED}s"
done
echo ""

if [ $WAITED -ge $MAX_WAIT ]; then
    error "Backend did not start within ${MAX_WAIT}s. Check: tail -50 $LOG_FILE"
fi

# ── 8. Final health check ─────────────────────────────────────────────────────
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080/api/lost-reports?pageSize=1" 2>/dev/null || echo "000")

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           🎉  Stack is FULLY RUNNING!            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${CYAN}Backend API :${NC}  http://localhost:8080"
echo -e "  ${CYAN}API Docs    :${NC}  http://localhost:8080/swagger-ui.html"
echo -e "  ${CYAN}Kafka UI    :${NC}  http://localhost:8090  (if kafka-ui container is running)"
echo -e "  ${CYAN}Backend PID :${NC}  $BACKEND_PID"
echo -e "  ${CYAN}Startup time:${NC}  $STARTUP_TIME"
echo -e "  ${CYAN}HTTP check  :${NC}  $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo '✅' || echo '⚠️ ')"
echo ""
echo -e "  ${YELLOW}Logs:${NC}  tail -f $LOG_FILE"
echo -e "  ${YELLOW}Stop:${NC}  bash $SCRIPT_DIR/stop-all.sh"
echo ""
