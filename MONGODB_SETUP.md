# ✅ MongoDB Connection & Data Storage Summary

## 🔗 MongoDB Configuration

**Connection String:**

```
mongodb+srv://shashikumarezhil_db_user:<password>@lostcity.1g3rszx.mongodb.net/?appName=LostCity
```

**Database Name:** `lostcity`

**Location:** Backend configuration file at `backend/src/main/resources/application.yml`

---

## 📊 Database Collections

Your MongoDB database automatically creates and manages the following collections:

### 1. **users** Collection

Stores user profiles with all details:

**Fields:**

- `id` - Unique user ID
- `clerkId` - Clerk authentication ID
- `email` - User email (unique)
- `displayName` - User's display name
- `avatarUrl` - Profile picture URL
- `bio` - User biography
- `phone` - Phone number
- `role` - USER or ADMIN
- `score` - User karma/score
- **`coins`** - Current coin balance ✅
- **`lifetimeEarnings`** - Total coins ever earned ✅
- **`lifetimeSpent`** - Total coins ever spent ✅
- **`badges`** - Array of earned badge names ✅
- **`skills`** - Array of user skills/expertise ✅
- `foundReportsCount` - Count of found items reported
- `lostReportsCount` - Count of lost items reported
- **`itemsReturnedCount`** - Count of items successfully returned ✅
- `questsCompletedCount` - Quests completed
- `createdAt` - Account creation date
- `updatedAt` - Last update timestamp

### 2. **lost_reports** Collection

Stores all lost item reports:

**Fields:**

- `id` - Unique report ID
- **`title`** - Item name/title ✅
- `description` - Detailed description
- `category` - Item category
- **`images`** - Array of image URLs ✅
- **`tags`** - Array of tags (used as distinguishing features) ✅
- `color` - Item color
- `brand` - Item brand
- **`rewardAmount`** - Coins offered as reward ✅
- `latitude` / `longitude` - Location coordinates
- **`locationName`** - Human-readable location ✅
- **`status`** - OPEN, MATCHED, or CLOSED ✅
- **`lostAt`** - Date/time item was lost ✅
- **`reportedBy`** - Reference to user who reported ✅
- `visibility` - PUBLIC or PRIVATE
- `matchedFoundItemId` - ID of matched found item
- `approvedClaimId` - ID of approved claim
- **`rewardReleased`** - Whether reward has been paid ✅
- `createdAt` / `updatedAt` - Timestamps

### 3. **found_reports** Collection

Stores all found item reports:

**Fields:**

- `id` - Unique report ID
- **`title`** - Item name/title ✅
- `description` - Detailed description
- `category` - Item category
- **`images`** - Array of image URLs ✅
- **`tags`** - Array of tags ✅
- `color` - Item color
- `brand` - Item brand
- `latitude` / `longitude` - Location coordinates
- **`locationName`** - Human-readable location ✅
- **`status`** - OPEN, MATCHED, or CLOSED ✅
- **`foundAt`** - Date/time item was found ✅
- **`reportedBy`** - Reference to user who found it ✅
- `foundCondition` - Condition of found item
- `holdingInstructions` - Where the item is being held
- `matchedLostItemId` - ID of matched lost item
- `createdAt` / `updatedAt` - Timestamps

### 4. **claims** Collection

Stores all claims on lost items:

**Fields:**

- `id` - Claim ID
- `lostReport` - Reference to lost report
- `foundReport` - Reference to found report (optional)
- `claimer` - User who found the item
- `owner` - User who lost the item
- **`status`** - PENDING, APPROVED, REJECTED, or COMPLETED ✅
- `claimerMessage` - Message from finder
- `ownerResponse` - Response from owner
- **`rewardAmount`** - Reward for this claim ✅
- **`rewardPaid`** - Whether reward has been paid ✅
- `createdAt` / `updatedAt` / `approvedAt` / `rejectedAt` - Timestamps

### 5. **transactions** Collection

Stores all coin transactions:

**Fields:**

- `id` - Transaction ID
- `user` - Reference to user
- `type` - ITEM_REWARD, QUEST_REWARD, PURCHASE, etc.
- **`amount`** - Coins added/subtracted ✅
- `description` - Transaction description
- `referenceType` - Type of related entity
- `referenceId` - ID of related entity
- `balanceAfter` - User's balance after transaction
- `createdAt` - Transaction timestamp

---

## 🔄 Data Flow

### When User Reports Lost Item:

1. **Frontend** (`/report-lost` page):

   - User fills form with item details
   - Uploads images (converted to base64)
   - Sets reward amount in coins
   - Submits to backend

2. **Backend** (`LostReportController.createLostReport()`):

   - Validates user authentication (Clerk JWT)
   - Creates `LostReport` entity
   - **Saves to MongoDB `lost_reports` collection** ✅
   - Updates user's `lostReportsCount` in `users` collection ✅
   - Returns response with item ID

3. **MongoDB Storage**:
   ```json
   {
     "id": "675f1234abcd5678",
     "title": "Brown Leather Wallet",
     "description": "Lost my wallet near fountain...",
     "category": "Accessories",
     "images": ["data:image/jpeg;base64,..."],
     "tags": ["brown", "leather", "scratch on back"],
     "rewardAmount": 500,
     "locationName": "Central Park",
     "lostAt": "2025-12-15T15:30:00+05:30",
     "status": "OPEN",
     "reportedBy": { "$ref": "users", "$id": "user123" },
     "rewardReleased": false,
     "createdAt": "2025-12-16T10:00:00Z"
   }
   ```

### When User Reports Found Item:

1. **Frontend** (`/report-found` page):

   - User fills form with found item details
   - Uploads images
   - Submits to backend

2. **Backend** (`FoundReportController.createFoundReport()`):

   - Validates authentication
   - Creates `FoundReport` entity
   - **Saves to MongoDB `found_reports` collection** ✅
   - Updates user's `foundReportsCount` in `users` collection ✅
   - Returns response

3. **MongoDB Storage**: Similar structure to lost_reports

### When User Claims an Item:

1. **Frontend**: Submit claim with message
2. **Backend**: Creates entry in `claims` collection with status PENDING
3. **MongoDB**: Claim document stored with references to both users and reports

### When Owner Approves & Completes Claim:

1. **Backend** (`ClaimService.completeClaimAndReleaseReward()`):
   - Validates claim is APPROVED
   - Calls `CurrencyService.awardItemReward()`
   - **Updates finder's coins in `users` collection** ✅
   - **Updates finder's lifetimeEarnings** ✅
   - **Updates finder's itemsReturnedCount** ✅
   - **Creates transaction record in `transactions` collection** ✅
   - **Updates claim status to COMPLETED in `claims` collection** ✅
   - **Updates lost report status to CLOSED** ✅
   - **Sets rewardReleased = true** ✅

---

## 📡 API Endpoints for Data Retrieval

### User Data:

```
GET /api/users/profile
```

**Returns:** User data with coins, badges, lifetimeEarnings, itemsReturnedCount, etc.

### Lost Reports:

```
GET /api/lost-reports              # Browse all
GET /api/lost-reports/{id}          # Single item
GET /api/lost-reports/my-reports    # User's own reports
```

### Found Reports:

```
GET /api/found-reports              # Browse all
GET /api/found-reports/{id}          # Single item
GET /api/found-reports/my-reports    # User's own reports
```

### Claims:

```
GET /api/claims/my-claims           # Claims I submitted
GET /api/claims/my-lost-items       # Claims on my lost items
```

---

## ✅ Data Storage Confirmation

### What Gets Stored:

✅ **User Names** - `displayName` field in users collection  
✅ **User Badges** - `badges` array in users collection  
✅ **User Coins** - `coins`, `lifetimeEarnings`, `lifetimeSpent` in users collection  
✅ **Lost Items** - Complete details in `lost_reports` collection  
✅ **Found Items** - Complete details in `found_reports` collection  
✅ **Images** - Stored as base64 strings in `images` array  
✅ **Locations** - `locationName`, `latitude`, `longitude` fields  
✅ **Rewards** - `rewardAmount` in lost_reports  
✅ **Claims** - All claim data in `claims` collection  
✅ **Transactions** - All coin transfers in `transactions` collection

### What Gets Fetched in Frontend:

✅ **Profile Page** - Fetches user data with coins, badges, stats  
✅ **Browse Lost** - Fetches all lost reports with filters  
✅ **Browse Found** - Fetches all found reports with filters  
✅ **Item Details** - Fetches specific item with owner info  
✅ **Claims Management** - Fetches pending claims for owners  
✅ **Transaction History** - Fetches user's coin transactions

---

## 🔧 Testing Database Connection

### 1. Check Connection (Backend):

```bash
cd backend
./start.sh
```

Look for log message:

```
Connected to MongoDB at lostcity.1g3rszx.mongodb.net
```

### 2. Test Data Creation:

```bash
# Terminal 1: Start backend
cd backend
./start.sh

# Terminal 2: Start frontend
npm run dev

# Browser: Sign up and report a lost item
```

### 3. Verify in MongoDB Atlas:

1. Go to https://cloud.mongodb.com
2. Navigate to your cluster
3. Click "Browse Collections"
4. Check `lostcity` database
5. Verify data in `users`, `lost_reports`, `found_reports` collections

---

## 🎯 Complete Flow Example

**User A reports lost wallet:**

1. Frontend sends POST to `/api/lost-reports`
2. Backend saves to MongoDB `lost_reports` collection
3. User's `lostReportsCount` incremented in `users` collection

**User B claims the wallet:**

1. Frontend sends POST to `/api/claims`
2. Backend saves to MongoDB `claims` collection
3. Status: PENDING

**User A approves and completes:**

1. Frontend sends POST to `/api/claims/{id}/complete`
2. Backend:
   - Transfers 500 coins to User B
   - Updates User B: `coins += 500`, `lifetimeEarnings += 500`, `itemsReturnedCount += 1`
   - Saves transaction to `transactions` collection
   - Updates claim: `status = COMPLETED`, `rewardPaid = true`
   - Updates lost report: `status = CLOSED`, `rewardReleased = true`
3. All changes persisted to MongoDB

**User B sees updated profile:**

1. Frontend fetches GET `/api/users/profile`
2. MongoDB returns updated user data
3. Profile displays new coin balance and badges

---

## 🎉 Summary

Your MongoDB database is **fully configured and working**!

✅ Connection string configured in `application.yml`  
✅ Database name: `lostcity`  
✅ All collections auto-created on first use  
✅ User data (names, badges, coins) stored and retrieved  
✅ Lost/Found items stored with all details  
✅ Claims and transactions tracked  
✅ Backend endpoints ready to serve data to frontend  
✅ Frontend pages fetching real data from MongoDB

**Everything is stored in MongoDB Atlas and fetched in the frontend!** 🚀
