#!/bin/bash

# Direct MongoDB Mock Data Insertion Script
# This bypasses the API and inserts directly into MongoDB

echo "🚀 Adding Mock Data Directly to MongoDB..."
echo "==========================================="

# MongoDB connection (from your application.yml)
MONGO_URI="mongodb+srv://shashikumarezhil_db_user:MxBWjB6NqgSnO1vl@lostcity.1g3rszx.mongodb.net/lostcity?retryWrites=true&w=majority"

# Create a temporary MongoDB script
cat > /tmp/mongodb_insert.js << 'EOF'
// Switch to the database
use lostcity;

// Insert Users
print("Inserting users...");
db.users.insertMany([
  {
    "_id": ObjectId(),
    "clerkId": "user_test_john123",
    "email": "john.doe@test.com",
    "displayName": "John Doe",
    "coins": 100.0,
    "lifetimeEarnings": 100.0,
    "lifetimeSpent": 0.0,
    "badges": [],
    "skills": [],
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.User"
  },
  {
    "_id": ObjectId(),
    "clerkId": "user_test_sarah456",
    "email": "sarah.smith@test.com",
    "displayName": "Sarah Smith",
    "coins": 50.0,
    "lifetimeEarnings": 50.0,
    "lifetimeSpent": 0.0,
    "badges": [],
    "skills": [],
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.User"
  },
  {
    "_id": ObjectId(),
    "clerkId": "user_test_mike789",
    "email": "mike.johnson@test.com",
    "displayName": "Mike Johnson",
    "coins": 75.0,
    "lifetimeEarnings": 75.0,
    "lifetimeSpent": 0.0,
    "badges": [],
    "skills": [],
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.User"
  }
]);

// Get user IDs for references
var john = db.users.findOne({"email": "john.doe@test.com"});
var sarah = db.users.findOne({"email": "sarah.smith@test.com"});
var mike = db.users.findOne({"email": "mike.johnson@test.com"});

// Insert Lost Reports
print("Inserting lost reports...");
db.lost_reports.insertMany([
  {
    "_id": ObjectId(),
    "reporter": {"$ref": "users", "$id": john._id},
    "itemName": "MacBook Pro 16-inch",
    "category": "ELECTRONICS",
    "description": "Silver MacBook Pro with Lost City stickers on the cover",
    "lastSeenLocation": "Central Library, 3rd Floor",
    "lastSeenDate": new Date("2025-12-15T14:30:00Z"),
    "contactInfo": "john.doe@test.com",
    "status": "ACTIVE",
    "rewardAmount": 50.0,
    "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.LostReport"
  },
  {
    "_id": ObjectId(),
    "reporter": {"$ref": "users", "$id": john._id},
    "itemName": "Car Keys with Blue Keychain",
    "category": "KEYS",
    "description": "Toyota car keys with a blue leather keychain and house keys attached",
    "lastSeenLocation": "Student Center Cafeteria",
    "lastSeenDate": new Date("2025-12-16T10:00:00Z"),
    "contactInfo": "john.doe@test.com",
    "status": "ACTIVE",
    "rewardAmount": 20.0,
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.LostReport"
  },
  {
    "_id": ObjectId(),
    "reporter": {"$ref": "users", "$id": mike._id},
    "itemName": "Brown Leather Wallet",
    "category": "WALLET",
    "description": "Contains student ID card, credit cards, and some cash",
    "lastSeenLocation": "Gym Locker Room",
    "lastSeenDate": new Date("2025-12-14T18:45:00Z"),
    "contactInfo": "mike.johnson@test.com",
    "status": "ACTIVE",
    "rewardAmount": 30.0,
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.LostReport"
  }
]);

// Insert Found Reports
print("Inserting found reports...");
db.found_reports.insertMany([
  {
    "_id": ObjectId(),
    "finder": {"$ref": "users", "$id": sarah._id},
    "itemName": "iPhone 15 Pro",
    "category": "ELECTRONICS",
    "description": "Blue iPhone with cracked screen protector, has a cat wallpaper",
    "foundLocation": "Parking Lot B, near entrance",
    "foundDate": new Date("2025-12-16T09:00:00Z"),
    "currentLocation": "Campus Security Office, Building A",
    "contactInfo": "sarah.smith@test.com",
    "status": "ACTIVE",
    "imageUrl": "https://images.unsplash.com/photo-1592286927505-0af3e5b6ec8e",
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.FoundReport"
  },
  {
    "_id": ObjectId(),
    "finder": {"$ref": "users", "$id": sarah._id},
    "itemName": "Black North Face Backpack",
    "category": "BAG",
    "description": "Contains textbooks for Biology 101 and a water bottle",
    "foundLocation": "Science Building, Room 203",
    "foundDate": new Date("2025-12-15T16:20:00Z"),
    "currentLocation": "With me, contact to arrange pickup",
    "contactInfo": "sarah.smith@test.com",
    "status": "ACTIVE",
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.FoundReport"
  },
  {
    "_id": ObjectId(),
    "finder": {"$ref": "users", "$id": mike._id},
    "itemName": "Prescription Glasses",
    "category": "OTHER",
    "description": "Black frame glasses in a brown case",
    "foundLocation": "Main Auditorium, Seat C-15",
    "foundDate": new Date("2025-12-16T11:30:00Z"),
    "currentLocation": "Lost and Found Office",
    "contactInfo": "mike.johnson@test.com",
    "status": "ACTIVE",
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.FoundReport"
  }
]);

// Insert Quests
print("Inserting quests...");
db.quests.insertMany([
  {
    "_id": ObjectId(),
    "title": "First Find",
    "description": "Help find your first lost item and earn your first reward",
    "category": "BEGINNER",
    "xpReward": 100,
    "coinReward": 10.0,
    "difficulty": 1,
    "requirements": "Find and return 1 item to its owner",
    "active": true,
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.Quest"
  },
  {
    "_id": ObjectId(),
    "title": "Good Samaritan",
    "description": "Return 5 items to their owners and become a campus hero",
    "category": "FINDER",
    "xpReward": 500,
    "coinReward": 50.0,
    "difficulty": 3,
    "requirements": "Complete 5 successful returns",
    "active": true,
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.Quest"
  },
  {
    "_id": ObjectId(),
    "title": "Campus Hero",
    "description": "Reach legendary status by helping 10 people find their items",
    "category": "ADVANCED",
    "xpReward": 1000,
    "coinReward": 100.0,
    "difficulty": 5,
    "requirements": "Achieve 1000 XP and complete 10 successful returns",
    "active": true,
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.lostcity.model.Quest"
  }
]);

print("\n✅ Mock data inserted successfully!");
print("\nData Summary:");
print("  Users: " + db.users.count());
print("  Lost Reports: " + db.lost_reports.count());
print("  Found Reports: " + db.found_reports.count());
print("  Quests: " + db.quests.count());

EOF

# Execute the MongoDB script
echo ""
echo "Connecting to MongoDB and inserting data..."
mongosh "$MONGO_URI" < /tmp/mongodb_insert.js

echo ""
echo "==========================================="
echo "✨ Data Insertion Complete!"
echo "==========================================="
echo ""
echo "📊 Verify in your application:"
echo "  Lost Reports:  http://localhost:3000/browse-lost"
echo "  Found Reports: http://localhost:3000/browse-found"
echo "  Quests:        http://localhost:3000/quests"
echo ""
echo "🔍 Check API endpoints:"
echo "  curl http://localhost:8080/api/lost-reports"
echo "  curl http://localhost:8080/api/found-reports"
echo "  curl http://localhost:8080/api/quests"
echo ""

# Cleanup
rm /tmp/mongodb_insert.js
