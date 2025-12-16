#!/usr/bin/env node

/**
 * MongoDB Data Seeding Script for LostCity
 * Directly inserts mock data into MongoDB Atlas
 */

const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection string from application.yml
const MONGO_URI = "mongodb+srv://shashikumarezhil_db_user:CZHLkjeFvHz55vC5@lostcity.1g3rszx.mongodb.net/lostcity?retryWrites=true&w=majority&appName=LostCity";
const DB_NAME = "lostcity";

async function seedDatabase() {
  console.log("🌱 Seeding MongoDB with mock data...\n");
  
  const client = new MongoClient(MONGO_URI);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas\n");
    
    const db = client.db(DB_NAME);
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing data...");
    await db.collection('users').deleteMany({});
    await db.collection('lost_reports').deleteMany({});
    await db.collection('found_reports').deleteMany({});
    await db.collection('match_requests').deleteMany({});
    console.log("✅ Existing data cleared\n");
    
    // ===== INSERT USERS =====
    console.log("👥 Inserting users...");
    const users = [
      {
        _id: new ObjectId(),
        clerkId: "user_test_john123",
        email: "john.doe@test.com",
        displayName: "John Doe",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        bio: "Always losing things 😅",
        phone: "+1234567890",
        role: "USER",
        score: 150,
        coins: 100.0,
        lifetimeEarnings: 150.0,
        lifetimeSpent: 50.0,
        badges: ["First Report", "Helpful Finder"],
        skills: ["Quick Response", "Detailed Descriptions"],
        foundReportsCount: 2,
        lostReportsCount: 3,
        itemsReturnedCount: 1,
        questsCompletedCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.User"
      },
      {
        _id: new ObjectId(),
        clerkId: "user_test_sarah456",
        email: "sarah.smith@test.com",
        displayName: "Sarah Smith",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        bio: "Helping the community find their lost items",
        phone: "+1987654321",
        role: "USER",
        score: 200,
        coins: 150.0,
        lifetimeEarnings: 200.0,
        lifetimeSpent: 50.0,
        badges: ["Super Helper", "Quest Master"],
        skills: ["Fast Finder", "Detail Oriented"],
        foundReportsCount: 5,
        lostReportsCount: 1,
        itemsReturnedCount: 3,
        questsCompletedCount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.User"
      },
      {
        _id: new ObjectId(),
        clerkId: "user_test_mike789",
        email: "mike.johnson@test.com",
        displayName: "Mike Johnson",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        bio: "Tech enthusiast and finder",
        phone: "+1122334455",
        role: "USER",
        score: 75,
        coins: 75.0,
        lifetimeEarnings: 100.0,
        lifetimeSpent: 25.0,
        badges: ["Early Adopter"],
        skills: ["Electronics Expert"],
        foundReportsCount: 1,
        lostReportsCount: 2,
        itemsReturnedCount: 1,
        questsCompletedCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.User"
      }
    ];
    
    await db.collection('users').insertMany(users);
    console.log(`✅ Inserted ${users.length} users\n`);
    
    // Get user references
    const john = users[0];
    const sarah = users[1];
    const mike = users[2];
    
    // ===== INSERT LOST REPORTS =====
    console.log("📋 Inserting lost reports...");
    const lostReports = [
      {
        _id: new ObjectId(),
        reporterId: john._id,
        itemName: "MacBook Pro 16-inch",
        category: "ELECTRONICS",
        description: "Silver MacBook Pro with Lost City stickers on the cover. Has a small dent on the bottom left corner.",
        lastSeenLocation: "Central Library, 3rd Floor",
        lastSeenDate: new Date("2025-12-15T14:30:00Z"),
        contactInfo: "john.doe@test.com",
        status: "OPEN",
        rewardAmount: 50.0,
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.LostReport"
      },
      {
        _id: new ObjectId(),
        reporterId: john._id,
        itemName: "Car Keys with Blue Keychain",
        category: "KEYS",
        description: "Toyota car keys with a blue leather keychain and two house keys attached",
        lastSeenLocation: "Student Center Cafeteria",
        lastSeenDate: new Date("2025-12-16T10:00:00Z"),
        contactInfo: "john.doe@test.com",
        status: "OPEN",
        rewardAmount: 20.0,
        imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.LostReport"
      },
      {
        _id: new ObjectId(),
        reporterId: mike._id,
        itemName: "Brown Leather Wallet",
        category: "WALLET",
        description: "Contains student ID, two credit cards, and some cash",
        lastSeenLocation: "Gym Locker Room",
        lastSeenDate: new Date("2025-12-14T18:45:00Z"),
        contactInfo: "mike.johnson@test.com",
        status: "OPEN",
        rewardAmount: 30.0,
        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.LostReport"
      },
      {
        _id: new ObjectId(),
        reporterId: sarah._id,
        itemName: "Red Backpack",
        category: "BAG",
        description: "North Face red backpack with laptop compartment. Has a small teddy bear keychain.",
        lastSeenLocation: "Bus Stop near Campus",
        lastSeenDate: new Date("2025-12-13T08:15:00Z"),
        contactInfo: "sarah.smith@test.com",
        status: "MATCHED",
        rewardAmount: 25.0,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.LostReport"
      }
    ];
    
    await db.collection('lost_reports').insertMany(lostReports);
    console.log(`✅ Inserted ${lostReports.length} lost reports\n`);
    
    // ===== INSERT FOUND REPORTS =====
    console.log("📦 Inserting found reports...");
    const foundReports = [
      {
        _id: new ObjectId(),
        finderId: sarah._id,
        itemName: "iPhone 13 Pro",
        category: "ELECTRONICS",
        description: "Black iPhone with a purple case. Lock screen shows a dog photo.",
        foundLocation: "Science Building, Room 204",
        foundDate: new Date("2025-12-16T11:00:00Z"),
        contactInfo: "sarah.smith@test.com",
        status: "OPEN",
        imageUrl: "https://images.unsplash.com/photo-1592286927505-c0d0eb5f428b?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.FoundReport"
      },
      {
        _id: new ObjectId(),
        finderId: sarah._id,
        itemName: "Blue Water Bottle",
        category: "OTHER",
        description: "Hydro Flask blue water bottle with stickers",
        foundLocation: "Basketball Court",
        foundDate: new Date("2025-12-15T16:30:00Z"),
        contactInfo: "sarah.smith@test.com",
        status: "OPEN",
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.FoundReport"
      },
      {
        _id: new ObjectId(),
        finderId: mike._id,
        itemName: "Textbook - Calculus II",
        category: "DOCUMENTS",
        description: "Calculus textbook with name 'Emma Wilson' written inside",
        foundLocation: "Mathematics Building, 2nd Floor",
        foundDate: new Date("2025-12-14T13:20:00Z"),
        contactInfo: "mike.johnson@test.com",
        status: "MATCHED",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.FoundReport"
      },
      {
        _id: new ObjectId(),
        finderId: john._id,
        itemName: "Prescription Glasses",
        category: "ACCESSORIES",
        description: "Black frame prescription glasses in a brown case",
        foundLocation: "Library Study Room 3",
        foundDate: new Date("2025-12-13T19:00:00Z"),
        contactInfo: "john.doe@test.com",
        status: "OPEN",
        imageUrl: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.FoundReport"
      },
      {
        _id: new ObjectId(),
        finderId: sarah._id,
        itemName: "Gold Ring",
        category: "JEWELRY",
        description: "Gold ring with small diamond, possibly engagement ring",
        foundLocation: "Women's Restroom, Engineering Building",
        foundDate: new Date("2025-12-12T14:00:00Z"),
        contactInfo: "sarah.smith@test.com",
        status: "OPEN",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.lostcity.model.FoundReport"
      }
    ];
    
    await db.collection('found_reports').insertMany(foundReports);
    console.log(`✅ Inserted ${foundReports.length} found reports\n`);
    
    // ===== SUMMARY =====
    console.log("📊 Database Seeding Summary:");
    console.log("============================");
    console.log(`✅ Users: ${users.length}`);
    console.log(`✅ Lost Reports: ${lostReports.length}`);
    console.log(`✅ Found Reports: ${foundReports.length}`);
    console.log("\n🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the seeding
seedDatabase();
