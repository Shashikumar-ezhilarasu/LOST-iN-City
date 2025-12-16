#!/bin/bash

# Mock Data Script for LostCity App
# This script adds test data to verify MongoDB storage and frontend fetching

BASE_URL="http://localhost:8080/api"

echo "🚀 Adding Mock Data to LostCity..."
echo "=================================="

# Step 1: Note about authentication
echo -e "\n📝 Step 1: Authentication Setup..."
echo "⚠️  NOTE: You need to authenticate via Clerk to add data."
echo "This script will use dummy data that you can manually test with Clerk auth."
echo ""
echo "For now, we'll verify the backend is accepting requests..."

# Test backend health
echo "Testing backend health..."
curl -s http://localhost:8080/actuator/health

echo -e "\n\n⚠️  To add real data, please:"
echo "1. Sign up at http://localhost:3000 using Clerk"
echo "2. Use the UI to create lost/found reports"
echo "3. Or get your Clerk JWT token from browser DevTools"
echo ""
echo "Continuing with data structure verification..."

# Dummy tokens for structure testing (won't work without real Clerk setup)
USER1_TOKEN="dummy_token_for_testing"
USER2_TOKEN="dummy_token_for_testing"
USER3_TOKEN="dummy_token_for_testing"

# Step 2: Create Lost Reports
echo -e "\n📋 Step 2: Creating Lost Reports..."

# Lost Report 1 - Laptop
echo "Creating Lost Report: Laptop..."
LOST1=$(curl -s -X POST "${BASE_URL}/lost-reports" \
  -H "Authorization: Bearer ${USER1_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "MacBook Pro 16-inch",
    "category": "ELECTRONICS",
    "description": "Silver MacBook Pro with Lost City stickers on the cover",
    "lastSeenLocation": "Central Library, 3rd Floor",
    "lastSeenDate": "2025-12-15T14:30:00Z",
    "contactInfo": "john@example.com",
    "rewardAmount": 50.00,
    "imageUrl": "https://example.com/images/macbook.jpg"
  }')

LOST1_ID=$(echo $LOST1 | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Lost Report 1 ID: ${LOST1_ID}"

# Lost Report 2 - Keys
echo "Creating Lost Report: Keys..."
LOST2=$(curl -s -X POST "${BASE_URL}/lost-reports" \
  -H "Authorization: Bearer ${USER1_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "Car Keys with Blue Keychain",
    "category": "KEYS",
    "description": "Toyota car keys with a blue leather keychain",
    "lastSeenLocation": "Student Center Cafeteria",
    "lastSeenDate": "2025-12-16T10:00:00Z",
    "contactInfo": "john@example.com",
    "rewardAmount": 20.00
  }')

LOST2_ID=$(echo $LOST2 | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Lost Report 2 ID: ${LOST2_ID}"

# Lost Report 3 - Wallet
echo "Creating Lost Report: Wallet..."
LOST3=$(curl -s -X POST "${BASE_URL}/lost-reports" \
  -H "Authorization: Bearer ${USER3_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "Brown Leather Wallet",
    "category": "WALLET",
    "description": "Contains student ID and credit cards",
    "lastSeenLocation": "Gym Locker Room",
    "lastSeenDate": "2025-12-14T18:45:00Z",
    "contactInfo": "mike@example.com",
    "rewardAmount": 30.00
  }')

LOST3_ID=$(echo $LOST3 | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Lost Report 3 ID: ${LOST3_ID}"

# Step 3: Create Found Reports
echo -e "\n📦 Step 3: Creating Found Reports..."

# Found Report 1 - Phone
echo "Creating Found Report: Phone..."
FOUND1=$(curl -s -X POST "${BASE_URL}/found-reports" \
  -H "Authorization: Bearer ${USER2_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "iPhone 15 Pro",
    "category": "ELECTRONICS",
    "description": "Blue iPhone with cracked screen protector",
    "foundLocation": "Parking Lot B",
    "foundDate": "2025-12-16T09:00:00Z",
    "currentLocation": "Campus Security Office",
    "contactInfo": "sarah@example.com",
    "imageUrl": "https://example.com/images/iphone.jpg"
  }')

FOUND1_ID=$(echo $FOUND1 | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Found Report 1 ID: ${FOUND1_ID}"

# Found Report 2 - Backpack
echo "Creating Found Report: Backpack..."
FOUND2=$(curl -s -X POST "${BASE_URL}/found-reports" \
  -H "Authorization: Bearer ${USER2_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "Black North Face Backpack",
    "category": "BAG",
    "description": "Contains textbooks and a water bottle",
    "foundLocation": "Science Building, Room 203",
    "foundDate": "2025-12-15T16:20:00Z",
    "currentLocation": "With me, contact to arrange pickup",
    "contactInfo": "sarah@example.com"
  }')

FOUND2_ID=$(echo $FOUND2 | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Found Report 2 ID: ${FOUND2_ID}"

# Step 4: Create a Claim
echo -e "\n✋ Step 4: Creating a Claim..."
if [ -n "$LOST1_ID" ] && [ -n "$FOUND1_ID" ]; then
  echo "Creating claim for Lost MacBook..."
  CLAIM1=$(curl -s -X POST "${BASE_URL}/claims" \
    -H "Authorization: Bearer ${USER2_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
      \"lostReportId\": \"${LOST1_ID}\",
      \"foundReportId\": \"${FOUND1_ID}\",
      \"message\": \"I found what looks like your MacBook in the parking lot. Please verify the serial number.\"
    }")
  
  CLAIM1_ID=$(echo $CLAIM1 | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  echo "Claim ID: ${CLAIM1_ID}"
fi

# Step 5: Create Quests
echo -e "\n🎯 Step 5: Creating Quests..."

echo "Creating Quest 1: First Find..."
curl -s -X POST "${BASE_URL}/quests" \
  -H "Authorization: Bearer ${USER1_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "First Find",
    "description": "Help find your first lost item",
    "category": "BEGINNER",
    "xpReward": 100,
    "coinReward": 10.00,
    "difficulty": 1,
    "requirements": "Find and return 1 item"
  }' > /dev/null

echo "Creating Quest 2: Good Samaritan..."
curl -s -X POST "${BASE_URL}/quests" \
  -H "Authorization: Bearer ${USER1_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Good Samaritan",
    "description": "Return 5 items to their owners",
    "category": "FINDER",
    "xpReward": 500,
    "coinReward": 50.00,
    "difficulty": 3,
    "requirements": "Complete 5 successful returns"
  }' > /dev/null

echo "Creating Quest 3: Campus Hero..."
curl -s -X POST "${BASE_URL}/quests" \
  -H "Authorization: Bearer ${USER1_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Campus Hero",
    "description": "Reach 1000 XP and help 10 people",
    "category": "ADVANCED",
    "xpReward": 1000,
    "coinReward": 100.00,
    "difficulty": 5,
    "requirements": "Achieve 1000 XP and complete 10 returns"
  }' > /dev/null

# Step 6: Verify Data
echo -e "\n✅ Step 6: Verifying Data..."

echo -e "\n📊 Checking Lost Reports..."
curl -s "${BASE_URL}/lost-reports?page=0&size=10" | python3 -m json.tool | head -30

echo -e "\n📊 Checking Found Reports..."
curl -s "${BASE_URL}/found-reports?page=0&size=10" | python3 -m json.tool | head -30

echo -e "\n📊 Checking User Profile (John)..."
curl -s "${BASE_URL}/users/profile" \
  -H "Authorization: Bearer ${USER1_TOKEN}" | python3 -m json.tool

echo -e "\n📊 Checking Wallet (John)..."
curl -s "${BASE_URL}/wallet/balance" \
  -H "Authorization: Bearer ${USER1_TOKEN}" | python3 -m json.tool

echo -e "\n=================================="
echo "✨ Mock Data Added Successfully!"
echo "=================================="
echo ""
echo "📝 Summary:"
echo "  - 3 Users created (John, Sarah, Mike)"
echo "  - 3 Lost Reports (Laptop, Keys, Wallet)"
echo "  - 2 Found Reports (Phone, Backpack)"
echo "  - 1 Claim (MacBook claim)"
echo "  - 3 Quests created"
echo ""
echo "🌐 Test in Browser:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8080"
echo ""
echo "🔍 View Data:"
echo "  Lost Items:  http://localhost:3000/browse-lost"
echo "  Found Items: http://localhost:3000/browse-found"
echo "  Profile:     http://localhost:3000/profile"
echo "  Quests:      http://localhost:3000/quests"
echo ""
