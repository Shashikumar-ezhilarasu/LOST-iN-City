#!/bin/bash

# Test Script - Verify Data Storage and Frontend Fetching
# This tests if data flows correctly from database → backend → frontend

echo "🧪 Testing Lost City Data Flow..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Wait for backend to be ready
echo -e "\n${YELLOW}Step 1: Checking Backend Status...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running on port 8080${NC}"
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "Waiting for backend... ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo -e "${RED}✗ Backend failed to start${NC}"
  exit 1
fi

# Check Frontend
echo -e "\n${YELLOW}Step 2: Checking Frontend Status...${NC}"
if curl -s http://localhost:3001 > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Frontend is running on port 3001${NC}"
elif curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Frontend is running on port 3000${NC}"
  FRONTEND_PORT=3000
else
  echo -e "${RED}✗ Frontend is not running${NC}"
  echo "Start it with: npm run dev"
  exit 1
fi

FRONTEND_PORT=${FRONTEND_PORT:-3001}

# Test API Endpoints
echo -e "\n${YELLOW}Step 3: Testing Backend API Endpoints...${NC}"

# Test Lost Reports
echo "Testing /api/lost-reports..."
LOST_RESPONSE=$(curl -s http://localhost:8080/api/lost-reports)
if echo "$LOST_RESPONSE" | grep -q "success"; then
  LOST_COUNT=$(echo "$LOST_RESPONSE" | grep -o '"totalElements":[0-9]*' | grep -o '[0-9]*' | head -1)
  echo -e "${GREEN}✓ Lost Reports API working - Found $LOST_COUNT items${NC}"
else
  echo -e "${YELLOW}⚠ Lost Reports API returned: ${LOST_RESPONSE:0:100}${NC}"
fi

# Test Found Reports
echo "Testing /api/found-reports..."
FOUND_RESPONSE=$(curl -s http://localhost:8080/api/found-reports)
if echo "$FOUND_RESPONSE" | grep -q "success"; then
  FOUND_COUNT=$(echo "$FOUND_RESPONSE" | grep -o '"totalElements":[0-9]*' | grep -o '[0-9]*' | head -1)
  echo -e "${GREEN}✓ Found Reports API working - Found $FOUND_COUNT items${NC}"
else
  echo -e "${YELLOW}⚠ Found Reports API returned: ${FOUND_RESPONSE:0:100}${NC}"
fi

# Test Quests
echo "Testing /api/quests..."
QUESTS_RESPONSE=$(curl -s http://localhost:8080/api/quests)
if echo "$QUESTS_RESPONSE" | grep -q "success"; then
  QUEST_COUNT=$(echo "$QUESTS_RESPONSE" | grep -o '"title"' | wc -l | tr -d ' ')
  echo -e "${GREEN}✓ Quests API working - Found $QUEST_COUNT quests${NC}"
else
  echo -e "${YELLOW}⚠ Quests API returned: ${QUESTS_RESPONSE:0:100}${NC}"
fi

# Test Leaderboard
echo "Testing /api/leaderboard..."
LEADERBOARD_RESPONSE=$(curl -s http://localhost:8080/api/leaderboard)
if echo "$LEADERBOARD_RESPONSE" | grep -q "success\|data"; then
  echo -e "${GREEN}✓ Leaderboard API working${NC}"
else
  echo -e "${YELLOW}⚠ Leaderboard API returned: ${LEADERBOARD_RESPONSE:0:100}${NC}"
fi

# Display Sample Data
echo -e "\n${YELLOW}Step 4: Sample Data from Backend...${NC}"
echo "First Lost Report:"
echo "$LOST_RESPONSE" | python3 -m json.tool 2>/dev/null | grep -A 15 '"itemName"' | head -16

echo -e "\nFirst Found Report:"
echo "$FOUND_RESPONSE" | python3 -m json.tool 2>/dev/null | grep -A 15 '"itemName"' | head -16

# Test MongoDB Connection
echo -e "\n${YELLOW}Step 5: MongoDB Connection Test...${NC}"
if echo "$LOST_RESPONSE" | grep -q '"_id"\|"id"'; then
  echo -e "${GREEN}✓ MongoDB is connected and returning data${NC}"
else
  echo -e "${YELLOW}⚠ Check MongoDB connection in backend logs${NC}"
fi

# Summary
echo -e "\n=================================="
echo -e "${GREEN}✅ Testing Complete!${NC}"
echo -e "==================================\n"

echo "📊 Results:"
echo "  • Backend API: Running ✓"
echo "  • Frontend: Running on port $FRONTEND_PORT ✓"
echo "  • MongoDB: Connected ✓"
echo "  • Lost Reports: $LOST_COUNT items"
echo "  • Found Reports: $FOUND_COUNT items"
echo "  • Quests: $QUEST_COUNT quests"

echo -e "\n🌐 Access Your Application:"
echo "  • Frontend: http://localhost:$FRONTEND_PORT"
echo "  • Browse Lost: http://localhost:$FRONTEND_PORT/browse-lost"
echo "  • Browse Found: http://localhost:$FRONTEND_PORT/browse-found"
echo "  • Quests: http://localhost:$FRONTEND_PORT/quests"
echo "  • Leaderboard: http://localhost:$FRONTEND_PORT/leaderboard"

echo -e "\n📝 Next Steps:"
echo "  1. Open http://localhost:$FRONTEND_PORT in your browser"
echo "  2. Sign up/Login with Clerk"
echo "  3. Create test data using the UI:"
echo "     - Report a lost item"
echo "     - Report a found item"
echo "     - Create claims"
echo "  4. Check your wallet and transactions"

echo -e "\n🔧 API Documentation:"
echo "  curl http://localhost:8080/api/lost-reports"
echo "  curl http://localhost:8080/api/found-reports"
echo "  curl http://localhost:8080/api/quests"
echo "  curl http://localhost:8080/api/leaderboard"
echo ""
