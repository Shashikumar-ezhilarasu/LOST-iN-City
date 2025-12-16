# 🔍 How to Verify Data in MongoDB

## ✅ Current Status

- ✅ Backend connected to MongoDB Atlas: `lostcity.1g3rszx.mongodb.net`
- ✅ Database name: `lostcity`
- ✅ Backend running on: http://localhost:8080
- ✅ Frontend running on: http://localhost:3000

---

## 📊 Collections That Will Be Created

When you start using the app, MongoDB will **automatically create** these collections:

### 1. **users** Collection

Created when: First user signs up

**What you'll see:**

```json
{
  "_id": "675f1234abcd5678",
  "clerkId": "user_2abc123...",
  "email": "yourname@example.com",
  "displayName": "Your Name",
  "avatarUrl": "https://...",
  "role": "USER",
  "score": 0,
  "coins": 0.0,
  "lifetimeEarnings": 0.0,
  "lifetimeSpent": 0.0,
  "badges": [],
  "skills": [],
  "foundReportsCount": 0,
  "lostReportsCount": 0,
  "itemsReturnedCount": 0,
  "questsCompletedCount": 0,
  "createdAt": "2025-12-16T10:00:00Z",
  "updatedAt": "2025-12-16T10:00:00Z",
  "_class": "com.lostcity.model.User"
}
```

### 2. **lost_reports** Collection

Created when: First lost item is reported

**What you'll see:**

```json
{
  "_id": "675f5678efgh9012",
  "title": "Brown Leather Wallet",
  "description": "Lost my wallet near the fountain...",
  "category": "Accessories",
  "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRg..."],
  "tags": ["brown", "leather", "scratch on back"],
  "color": "Brown",
  "brand": "Gucci",
  "rewardAmount": 500.0,
  "latitude": 13.0827,
  "longitude": 80.2707,
  "locationName": "Chennai Central",
  "status": "OPEN",
  "lostAt": "2025-12-15T15:30:00+05:30",
  "reportedBy": {
    "$ref": "users",
    "$id": "675f1234abcd5678"
  },
  "visibility": "PUBLIC",
  "approvedClaimId": null,
  "rewardReleased": false,
  "createdAt": "2025-12-16T10:30:00Z",
  "updatedAt": "2025-12-16T10:30:00Z",
  "_class": "com.lostcity.model.LostReport"
}
```

### 3. **found_reports** Collection

Created when: First found item is reported

**What you'll see:**

```json
{
  "_id": "675f9012ijkl3456",
  "title": "Black iPhone 15",
  "description": "Found near bus stop...",
  "category": "Electronics",
  "images": ["data:image/jpeg;base64,..."],
  "tags": ["black", "cracked screen"],
  "foundAt": "2025-12-16T09:00:00+05:30",
  "locationName": "Marina Beach",
  "status": "OPEN",
  "reportedBy": {
    "$ref": "users",
    "$id": "675f1234abcd5678"
  },
  "foundCondition": "Good",
  "holdingInstructions": "At police station",
  "createdAt": "2025-12-16T11:00:00Z",
  "_class": "com.lostcity.model.FoundReport"
}
```

### 4. **claims** Collection

Created when: Someone claims a lost item

### 5. **transactions** Collection

Created when: Rewards are paid out

---

## 🎯 Step-by-Step: Test Data Creation

### Step 1: Sign Up a User

```bash
1. Go to: http://localhost:3000
2. Click "Sign Up" (top right corner)
3. Enter your details:
   - Email
   - Password
   - Display name
4. Click "Create Account"
```

**Result:** A new record in the `users` collection ✅

### Step 2: Report a Lost Item

```bash
1. After signing in, click "Report Lost" in bottom nav
2. Fill in the form:
   - Item Name: "Brown Leather Wallet"
   - Category: "Accessories"
   - Description: "Lost near fountain"
   - Upload a photo (optional)
   - Location: "Central Park"
   - Reward: 500 coins
3. Click "Submit Report"
```

**Result:** A new record in the `lost_reports` collection ✅

### Step 3: Report a Found Item

```bash
1. Click "Report Found" in bottom nav
2. Fill in the form:
   - Item Name: "Black iPhone"
   - Category: "Electronics"
   - Description: "Found at bus stop"
   - Location: "Main Street"
3. Click "Submit Report"
```

**Result:** A new record in the `found_reports` collection ✅

---

## 🔎 View Data in MongoDB Atlas

### Method 1: MongoDB Atlas Dashboard

```bash
1. Go to: https://cloud.mongodb.com
2. Log in with your MongoDB account
3. Click on your cluster: "lostcity.1g3rszx"
4. Click "Browse Collections" button
5. Select database: "lostcity"
6. You'll see all collections with data!
```

### Method 2: View via Frontend

```bash
# View your profile with coins and badges
http://localhost:3000/profile

# Browse all lost items
http://localhost:3000/browse-lost

# Browse all found items
http://localhost:3000/browse-found

# View specific item details
http://localhost:3000/lost-item/[item-id]
```

### Method 3: Direct API Calls

```bash
# Get all users (leaderboard)
curl http://localhost:8080/api/leaderboard

# Get all lost reports
curl http://localhost:8080/api/lost-reports

# Get all found reports
curl http://localhost:8080/api/found-reports

# Get your profile (needs authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/users/profile
```

---

## 🧪 Run Test Script

I've created a test script for you:

```bash
# Make it executable
chmod +x test-api.sh

# Run the tests
./test-api.sh
```

This will:

- ✅ Check if backend is running
- ✅ Test MongoDB connection
- ✅ Check if frontend is running
- ✅ Test all API endpoints
- ✅ Verify data can be retrieved

---

## 🎉 Expected Results

### In MongoDB Atlas Dashboard:

**Database:** `lostcity`

**Collections you'll see:**

- `users` - All registered users with coins, badges, stats
- `lost_reports` - All lost item reports
- `found_reports` - All found item reports
- `claims` - All claims on lost items (when someone claims)
- `transactions` - All coin transactions (when rewards are paid)

### Sample Data View in Atlas:

```
Database: lostcity
├── users (3 documents)
│   ├── Document 1: { displayName: "John Doe", coins: 500, badges: ["First Report"] }
│   ├── Document 2: { displayName: "Jane Smith", coins: 1000, badges: ["Helper"] }
│   └── Document 3: { displayName: "Bob Wilson", coins: 0, badges: [] }
│
├── lost_reports (5 documents)
│   ├── Document 1: { title: "Brown Wallet", rewardAmount: 500, status: "OPEN" }
│   ├── Document 2: { title: "Black Phone", rewardAmount: 1000, status: "MATCHED" }
│   └── ...
│
└── found_reports (3 documents)
    ├── Document 1: { title: "Blue Backpack", status: "OPEN" }
    └── ...
```

---

## 🐛 Troubleshooting

### Issue: Collections not appearing in MongoDB

**Solution:**

- Collections are only created when first data is saved
- Make sure you've signed up and created at least one report
- Wait a few seconds and refresh MongoDB Atlas

### Issue: Getting authentication errors

**Solution:**

- Make sure you're signed in with Clerk
- Check that JWT token is being sent in request headers
- Verify Clerk keys in `.env.local`

### Issue: Data not showing in frontend

**Solution:**

- Check browser console for errors (F12)
- Verify API URL in `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8080/api`
- Make sure backend is running on port 8080

### Issue: Cannot connect to MongoDB

**Solution:**

- Check your IP is whitelisted in MongoDB Atlas
- Verify connection string in `application.yml`
- Check MongoDB Atlas cluster is running (not paused)

---

## 📝 Summary

Your app is now fully connected to MongoDB! Every action creates or updates data:

| Action        | Collection Updated      | What Gets Saved                     |
| ------------- | ----------------------- | ----------------------------------- |
| Sign Up       | `users`                 | Email, name, coins (0), badges ([]) |
| Report Lost   | `lost_reports`          | Item details, reward, location      |
| Report Found  | `found_reports`         | Item details, location              |
| Claim Item    | `claims`                | Claim details, status               |
| Approve & Pay | `transactions`, `users` | Coin transfer, updated balances     |

**Everything is stored in MongoDB and fetched by the frontend!** 🚀
