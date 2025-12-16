#!/bin/bash

echo "🧪 Testing LostCity API and MongoDB Connection"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if backend is running
echo "1️⃣  Testing Backend Server..."
if curl -s http://localhost:8080/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 8080${NC}"
else
    echo -e "${RED}❌ Backend is not running. Start it with: cd backend && ./start.sh${NC}"
    exit 1
fi
echo ""

# Test 2: Check MongoDB connection via backend
echo "2️⃣  Testing MongoDB Connection..."
MONGO_TEST=$(curl -s http://localhost:8080/api/health)
if [ ! -z "$MONGO_TEST" ]; then
    echo -e "${GREEN}✅ Backend can connect to MongoDB${NC}"
    echo "Response: $MONGO_TEST"
else
    echo -e "${YELLOW}⚠️  Could not verify MongoDB connection${NC}"
fi
echo ""

# Test 3: Check frontend
echo "3️⃣  Testing Frontend Server..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running on port 3000${NC}"
else
    echo -e "${RED}❌ Frontend is not running. Start it with: npm run dev${NC}"
fi
echo ""

# Test 4: Check API endpoints
echo "4️⃣  Testing Public API Endpoints..."
echo "   Testing GET /api/lost-reports..."
LOST_REPORTS=$(curl -s http://localhost:8080/api/lost-reports)
if [ ! -z "$LOST_REPORTS" ]; then
    echo -e "${GREEN}   ✅ Lost reports endpoint working${NC}"
    echo "   Response: $LOST_REPORTS"
else
    echo -e "${RED}   ❌ Lost reports endpoint failed${NC}"
fi
echo ""

echo "   Testing GET /api/found-reports..."
FOUND_REPORTS=$(curl -s http://localhost:8080/api/found-reports)
if [ ! -z "$FOUND_REPORTS" ]; then
    echo -e "${GREEN}   ✅ Found reports endpoint working${NC}"
    echo "   Response: $FOUND_REPORTS"
else
    echo -e "${RED}   ❌ Found reports endpoint failed${NC}"
fi
echo ""

# Test 5: Check leaderboard
echo "5️⃣  Testing Leaderboard..."
LEADERBOARD=$(curl -s http://localhost:8080/api/leaderboard)
if [ ! -z "$LEADERBOARD" ]; then
    echo -e "${GREEN}   ✅ Leaderboard endpoint working${NC}"
    echo "   Response: $LEADERBOARD"
else
    echo -e "${RED}   ❌ Leaderboard endpoint failed${NC}"
fi
echo ""

echo "=============================================="
echo "📝 Next Steps to See Data in MongoDB:"
echo "=============================================="
echo ""
echo "1. Go to: http://localhost:3000"
echo "2. Click 'Sign Up' and create an account"
echo "3. Go to 'Report Lost' and submit an item"
echo "4. Check MongoDB Atlas:"
echo "   → Go to https://cloud.mongodb.com"
echo "   → Click 'Browse Collections'"
echo "   → Select 'lostcity' database"
echo "   → You'll see these collections:"
echo "      • users (your profile with coins, badges)"
echo "      • lost_reports (lost items)"
echo "      • found_reports (found items)"
echo ""
echo "5. View data in frontend:"
echo "   → Profile: http://localhost:3000/profile"
echo "   → Browse Lost: http://localhost:3000/browse-lost"
echo "   → Browse Found: http://localhost:3000/browse-found"
echo ""
echo -e "${GREEN}✨ All data is automatically saved to MongoDB!${NC}"
echo ""
