const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://shashiezhil:CZHLkjeFvHz55vC5@lostcity.3fwxb.mongodb.net/?retryWrites=true&w=majority&appName=lostCity";
const dbName = "lostcity";

// Helper to create ISO date strings (compatible with OffsetDateTime)
const createISODate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  // Return ISO string with timezone offset (e.g., 2024-12-15T10:30:00+05:30)
  const offset = "+05:30"; // IST timezone
  return date.toISOString().replace('Z', '') + offset;
};

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db(dbName);

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await db.collection('lost_reports').deleteMany({});
    await db.collection('found_reports').deleteMany({});
    await db.collection('users').deleteMany({});
    
    // Create users first
    console.log('\n👤 Creating users...');
    const users = await db.collection('users').insertMany([
      {
        clerkUserId: "user_demo1",
        username: "KnightFinder",
        email: "knight@example.com",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=knight",
        coins: 1500,
        reputation: 85,
        createdAt: createISODate(30),
        lastSeenAt: createISODate(0)
      },
      {
        clerkUserId: "user_demo2",
        username: "QuestMaster",
        email: "quest@example.com",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=quest",
        coins: 2000,
        reputation: 92,
        createdAt: createISODate(25),
        lastSeenAt: createISODate(1)
      },
      {
        clerkUserId: "user_demo3",
        username: "TreasureHunter",
        email: "treasure@example.com",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=treasure",
        coins: 1200,
        reputation: 78,
        createdAt: createISODate(20),
        lastSeenAt: createISODate(2)
      }
    ]);

    const userIds = Object.values(users.insertedIds);
    console.log(`✅ Created ${userIds.length} users`);

    // Create lost reports  
    console.log('\n📦 Creating lost reports...');
    const lostReports = await db.collection('lost_reports').insertMany([
      {
        title: "Brown Leather Wallet",
        description: "Lost near the fountain at Central Park. Contains credit cards and some cash. No ID inside. Brown leather with visible wear on edges.",
        category: "Personal Items",
        images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=400"],
        tags: ["wallet", "leather", "brown"],
        color: "Brown",
        brand: "Fossil",
        rewardAmount: 500,
        latitude: 12.9716,
        longitude: 77.5946,
        locationName: "Central Park, Bangalore",
        status: "OPEN",
        lostAt: createISODate(2),
        reportedBy: { "$ref": "users", "$id": userIds[0] },
        visibility: "PUBLIC",
        createdAt: createISODate(2),
        updatedAt: createISODate(2)
      },
      {
        title: "iPhone 14 Pro",
        description: "Black iPhone 14 Pro with cracked screen protector. Lost near the ticket booth at metro station.",
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"],
        tags: ["phone", "iphone", "electronics"],
        color: "Black",
        brand: "Apple",
        rewardAmount: 1500,
        latitude: 12.9352,
        longitude: 77.6245,
        locationName: "MG Road Metro Station, Bangalore",
        status: "OPEN",
        lostAt: createISODate(5),
        reportedBy: { "$ref": "users", "$id": userIds[1] },
        visibility: "PUBLIC",
        createdAt: createISODate(5),
        updatedAt: createISODate(5)
      },
      {
        title: "Blue Nike Backpack",
        description: "Navy blue Nike backpack with laptop compartment. Contains textbooks and notebooks. Lost at university library.",
        category: "Bags",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
        tags: ["backpack", "bag", "nike"],
        color: "Blue",
        brand: "Nike",
        rewardAmount: 800,
        latitude: 13.0127,
        longitude: 77.5654,
        locationName: "University Library, Bangalore",
        status: "OPEN",
        lostAt: createISODate(7),
        reportedBy: { "$ref": "users", "$id": userIds[2] },
        visibility: "PUBLIC",
        createdAt: createISODate(7),
        updatedAt: createISODate(7)
      },
      {
        title: "Car Keys with Toyota Fob",
        description: "Toyota car key fob with house keys attached. Blue keychain. Lost in shopping mall parking lot.",
        category: "Keys",
        images: ["https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400"],
        tags: ["keys", "car", "toyota"],
        color: "Black",
        brand: "Toyota",
        rewardAmount: 1000,
        latitude: 12.9917,
        longitude: 77.7153,
        locationName: "Phoenix Market City, Bangalore",
        status: "OPEN",
        lostAt: createISODate(3),
        reportedBy: { "$ref": "users", "$id": userIds[0] },
        visibility: "PUBLIC",
        createdAt: createISODate(3),
        updatedAt: createISODate(3)
      }
    ]);

    console.log(`✅ Created ${lostReports.insertedCount} lost reports`);

    // Create found reports
    console.log('\n🔍 Creating found reports...');
    const foundReports = await db.collection('found_reports').insertMany([
      {
        title: "Gold Necklace",
        description: "Delicate gold chain with heart pendant. Found on park bench near the playground.",
        category: "Accessories",
        images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400"],
        tags: ["necklace", "jewelry", "gold"],
        color: "Gold",
        brand: null,
        latitude: 12.9698,
        longitude: 77.7500,
        locationName: "Cubbon Park, Bangalore",
        status: "OPEN",
        foundAt: createISODate(1),
        foundBy: { "$ref": "users", "$id": userIds[1] },
        foundCondition: "Good condition, slight tarnish",
        holdingInstructions: "Available for pickup at park security office",
        visibility: "PUBLIC",
        createdAt: createISODate(1),
        updatedAt: createISODate(1)
      },
      {
        title: "Prescription Glasses",
        description: "Black frame prescription glasses in blue hard case. Found on coffee shop table.",
        category: "Personal Items",
        images: ["https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400"],
        tags: ["glasses", "eyewear"],
        color: "Black",
        brand: "Ray-Ban",
        latitude: 12.9279,
        longitude: 77.6271,
        locationName: "Starbucks, Indiranagar, Bangalore",
        status: "OPEN",
        foundAt: createISODate(4),
        foundBy: { "$ref": "users", "$id": userIds[2] },
        foundCondition: "Excellent condition",
        holdingInstructions: "Contact me to arrange pickup",
        visibility: "PUBLIC",
        createdAt: createISODate(4),
        updatedAt: createISODate(4)
      },
      {
        title: "Silver Watch",
        description: "Citizen watch with metal band. Battery still working. Found in gym locker room.",
        category: "Accessories",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"],
        tags: ["watch", "accessories"],
        color: "Silver",
        brand: "Citizen",
        latitude: 12.9611,
        longitude: 77.6387,
        locationName: "Gold's Gym, Koramangala, Bangalore",
        status: "OPEN",
        foundAt: createISODate(6),
        foundBy: { "$ref": "users", "$id": userIds[0] },
        foundCondition: "Working, minor scratches",
        holdingInstructions: "Kept with gym reception",
        visibility: "PUBLIC",
        createdAt: createISODate(6),
        updatedAt: createISODate(6)
      }
    ]);

    console.log(`✅ Created ${foundReports.insertedCount} found reports`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Users: ${userIds.length}`);
    console.log(`   Lost Reports: ${lostReports.insertedCount}`);
    console.log(`   Found Reports: ${foundReports.insertedCount}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

// Run the seeding
seedDatabase().catch(console.error);
