# Complete Claim & Reward Workflow Guide

## Overview

This document explains the complete end-to-end workflow from when someone finds an item to when the reward is released.

---

## 🎯 System Features

### 1. Initial Wallet Balance

- ✅ **Every new user starts with 500 coins**
- Located in: `backend/src/main/java/com/lostcity/model/User.java`
- Default value: `coins = 500.0`

### 2. Notification System

- ✅ **Real-time notification bell in header**
- Component: `components/NotificationBell.tsx`
- Polls every 30 seconds for new pending claims
- Shows red badge with count of pending claims
- Click to see dropdown with all pending claims
- Each notification links directly to the lost item page

### 3. Claim Management

- ✅ **Complete approve/reject workflow**
- Page: `app/lost-item/[id]/page.tsx`
- Owner can review messages from finders
- Owner can approve or reject claims
- Owner can release reward after verification

### 4. Coin Transfer System

- ✅ **Atomic transaction handling**
- Service: `backend/src/main/java/com/lostcity/service/CurrencyService.java`
- Deducts from owner's balance
- Adds to finder's balance
- Records transaction in database
- Updates lifetime earnings/spent statistics

---

## 📋 Complete Workflow

### Step 1: User Reports Lost Item

**Location:** `/report-lost` page

1. User fills out form with item details
2. User sets reward amount (e.g., 100 coins)
3. Item is posted to the system with status: `OPEN`
4. User's wallet balance: 500 coins (not deducted yet)

**Backend:**

- `POST /api/lost-reports`
- Creates `LostReport` document in MongoDB
- Status: `OPEN`

---

### Step 2: Someone Finds the Item

**Location:** `/browse-lost` → Click item → Claim button

1. Finder browses lost items
2. Finds matching item
3. Clicks "Claim This Item"
4. Fills out claim form with message explaining how they found it
5. Optionally attaches their found report with photos

**Backend:**

- `POST /api/claims`
- Creates `Claim` document with:
  - `lostReportId`: Link to lost item
  - `claimerId`: Finder's user ID
  - `claimerMessage`: Message to owner
  - `foundReportId`: Optional found report reference
  - `status`: `PENDING`
  - `rewardAmount`: Copied from lost report

---

### Step 3: Owner Gets Notified

**Location:** Header notification bell (all pages)

1. **Notification bell shows red badge** with count of pending claims
2. Owner clicks bell to see dropdown
3. Dropdown shows:
   - Item name
   - Finder's name
   - Message preview
   - Date claimed
   - "Click to review" link

**Technical Details:**

- `NotificationBell.tsx` polls `/api/claims/my-lost-items` every 30 seconds
- Filters for claims with status `PENDING`
- Real-time updates without page refresh

**Backend:**

- `GET /api/claims/my-lost-items`
- Returns all claims for current user's lost items
- Filters by user's `clerkId`

---

### Step 4: Owner Reviews the Claim

**Location:** `/lost-item/[id]` page

1. Owner clicks notification or navigates to their lost item
2. **Yellow banner at top** shows: "X People Have Claimed Your Item!"
3. Scrolls down to "CLAIMS" section
4. Sees detailed claim cards with:
   - ✅ Finder's profile picture and name
   - ✅ Finder's email address
   - ✅ **Highlighted message box** with finder's explanation
   - ✅ Attached found report details (if provided)
   - ✅ Images from found report
   - ✅ Timestamp of claim
   - ✅ "PENDING REVIEW" badge

**UI Features:**

- Message displayed in prominent yellow-bordered box
- Icon showing it's a message from finder
- Full message text with proper formatting
- Owner can add optional response message

---

### Step 5: Owner Approves the Claim

**Location:** Same page, click "Approve" button

1. Owner reads the message and verifies details
2. Optionally types response message
3. Clicks **"Approve"** button (green)
4. Confirms approval in dialog
5. Claim status changes to `APPROVED`
6. Lost item status changes to `MATCHED`

**What Happens:**

- Claim moves to "Approved Claim" section (blue box)
- Shows finder's full contact details
- Message displayed in prominent blue-bordered box
- Found report details shown
- **"VERIFY & RELEASE REWARD"** button appears

**Backend:**

- `POST /api/claims/{claimId}/approve`
- Updates claim status to `APPROVED`
- Updates lost report status to `MATCHED`
- Owner's wallet: Still 500 coins (not deducted yet)

---

### Step 6: Owner Meets Finder & Verifies Item

**Real-world action - Outside the app**

1. Owner contacts finder using displayed email/phone
2. They agree on safe public meeting location
3. Owner verifies the item is genuinely theirs
4. Finder hands over the item
5. Owner returns to the app

---

### Step 7: Owner Releases the Reward

**Location:** Same page, "VERIFY & RELEASE REWARD" button

1. Owner clicks **"VERIFY & RELEASE REWARD"** button
2. Confirms: "Have you received your item? This will release the reward..."
3. System processes the transaction

**What Happens:**

- 🎉 **Reward transferred!**
- Owner's wallet: 500 - 100 = 400 coins
- Finder's wallet: 500 + 100 = 600 coins
- Transaction record created
- Claim status: `COMPLETED`
- Claim `rewardPaid`: `true`
- Lost report status: `CLOSED`
- Success message: "🎉 Reward released successfully!"

**Backend Process:**

- `POST /api/claims/{claimId}/complete`
- Calls `ClaimService.completeClaimAndReleaseReward()`
- Which calls `CurrencyService.transferCoins(owner, finder, amount)`

**Atomic Transaction Steps:**

1. ✅ Validate claim is `APPROVED`
2. ✅ Check owner has sufficient coins (500 >= 100)
3. ✅ Deduct from owner: `coins = 500 - 100 = 400`
4. ✅ Update owner's `lifetimeSpent = 0 + 100 = 100`
5. ✅ Add to finder: `coins = 500 + 100 = 600`
6. ✅ Update finder's `lifetimeEarnings = 0 + 100 = 100`
7. ✅ Calculate reputation: `100 / 10 = 10 points`
8. ✅ Add reputation to finder: `score = 0 + 10 = 10`
9. ✅ Increment finder's `itemsReturnedCount = 0 + 1 = 1`
10. ✅ Create transaction record with:
    - `fromUserId`: Owner's ID
    - `toUserId`: Finder's ID
    - `amount`: 100
    - `type`: `REWARD`
    - `description`: "Reward for finding [item name]"
11. ✅ Mark claim as `COMPLETED`
12. ✅ Mark lost report as `CLOSED`

**Transaction Record:**

```json
{
  "id": "trans_xyz",
  "fromUserId": "owner_123",
  "toUserId": "finder_456",
  "amount": 100.0,
  "type": "REWARD",
  "description": "Reward for finding Laptop",
  "relatedEntityId": "claim_789",
  "relatedEntityType": "CLAIM",
  "createdAt": "2025-12-19T10:30:00Z"
}
```

---

## 💰 Wallet Statistics

### Owner's Updated Profile:

```
Current Balance: 400 coins (was 500)
Lifetime Spent: 100 coins
Lifetime Earnings: 0 coins
Items Lost: 1
Items Returned: 0
Score: 0 points
```

### Finder's Updated Profile:

```
Current Balance: 600 coins (was 500)
Lifetime Spent: 0 coins
Lifetime Earnings: 100 coins
Items Found: 1
Items Returned: 1
Score: 10 points (reward amount ÷ 10)
```

---

## 🔍 Technical Components

### Frontend Components:

1. **NotificationBell.tsx** - Real-time claim notifications
2. **WalletDisplay.tsx** - Shows current coin balance
3. **app/lost-item/[id]/page.tsx** - Claim management page
4. **app/browse-lost/page.tsx** - Browse lost items
5. **ClaimButton.tsx** - Claim item functionality

### Backend Services:

1. **ClaimService.java** - Manages claim lifecycle
2. **CurrencyService.java** - Handles coin transfers
3. **RewardCalculationService.java** - Calculates reputation
4. **UserService.java** - User management
5. **NotificationService.java** - (Future) Push notifications

### Backend Controllers:

1. **ClaimController.java** - Claim API endpoints
2. **WalletController.java** - Wallet operations
3. **LostReportController.java** - Lost item management

### Database Collections:

1. **users** - User profiles with coin balances
2. **lost_reports** - Lost item posts
3. **found_reports** - Found item reports
4. **claims** - Claim records
5. **transactions** - Financial transaction records

---

## 🎮 API Endpoints Used

### Notification System:

```
GET /api/claims/my-lost-items
- Returns all claims for user's lost items
- Used by NotificationBell component
```

### Claim Management:

```
GET /api/claims/lost-report/{lostReportId}
- Get all claims for a specific lost item
- Used by lost item detail page

POST /api/claims/{claimId}/approve
- Approve a claim
- Body: { response: "optional message" }

POST /api/claims/{claimId}/reject
- Reject a claim
- Body: { response: "optional message" }

POST /api/claims/{claimId}/complete
- Complete claim and release reward
- Triggers coin transfer
```

### Wallet Operations:

```
GET /api/wallet/stats
- Get current balance and statistics

POST /api/wallet/add-coins
- Add coins to wallet (for testing/purchase)
- Body: { amount: 100, payment_method: "manual" }
```

---

## ✅ Feature Checklist

### Initial Balance:

- [x] New users start with 500 coins
- [x] Default value set in User model
- [x] Applied on user creation

### Notifications:

- [x] Notification bell in header
- [x] Real-time polling (30 seconds)
- [x] Red badge with count
- [x] Dropdown with claim details
- [x] Links to lost item pages

### Claim Review:

- [x] Yellow banner for pending claims
- [x] Detailed claim cards
- [x] **Prominent message display** with icons
- [x] Finder profile information
- [x] Found report with images
- [x] Approve/Reject buttons

### Reward Release:

- [x] "VERIFY & RELEASE REWARD" button
- [x] Confirmation dialog
- [x] Atomic coin transfer
- [x] Transaction record creation
- [x] Balance updates (add/subtract)
- [x] Lifetime statistics tracking
- [x] Reputation calculation
- [x] Item returned count increment

### Security:

- [x] JWT authentication
- [x] User ownership verification
- [x] Sufficient balance check
- [x] @Transactional operations
- [x] Idempotency (can't release twice)

---

## 🚀 Testing the Complete Flow

### Test Scenario:

1. **User A** (Owner) - Starts with 500 coins
2. **User B** (Finder) - Starts with 500 coins

### Steps:

1. User A reports lost laptop with 150 coin reward
2. User B claims the laptop with message: "Found it near the coffee shop"
3. User A sees notification bell with red badge "1"
4. User A clicks bell, sees claim preview
5. User A clicks to view full claim
6. User A sees yellow banner: "1 Person Has Claimed Your Item!"
7. User A scrolls to Claims section
8. User A reads highlighted message box with finder's details
9. User A clicks "Approve"
10. Claim moves to blue "Approved Claim" section
11. User A meets User B and verifies laptop
12. User A clicks "VERIFY & RELEASE REWARD"
13. System transfers 150 coins: A(350) ← B(650)
14. Transaction record created
15. User B gets 15 reputation points (150 ÷ 10)
16. Lost item marked as CLOSED

### Expected Results:

- ✅ User A balance: 350 coins (500 - 150)
- ✅ User A lifetime spent: 150 coins
- ✅ User B balance: 650 coins (500 + 150)
- ✅ User B lifetime earnings: 150 coins
- ✅ User B score: 15 points
- ✅ User B items returned: 1
- ✅ Transaction recorded in database
- ✅ Lost item status: CLOSED
- ✅ Claim status: COMPLETED

---

## 🎨 UI/UX Highlights

### Message Display (NEW):

- **Prominent yellow-bordered box** for pending claims
- **Blue-bordered box** for approved claims
- **Message icon** next to "Message from Finder" label
- **Full message text** with proper formatting
- **Whitespace preserved** for line breaks
- **Avatar images** for finders
- **Timestamp** with full date/time

### Notification Banner (NEW):

- **Yellow banner at top** when pending claims exist
- Shows count: "X People Have Claimed Your Item!"
- Guides owner to scroll down for details

### Approved Claim Section (ENHANCED):

- Larger avatar with border
- Full finder contact information
- Message in highlighted box
- Found report details with images
- Clear call-to-action button
- Reward amount highlighted

---

## 📊 Database Schema

### User Document:

```json
{
  "id": "user_123",
  "clerkId": "clerk_xyz",
  "email": "user@example.com",
  "displayName": "John Doe",
  "coins": 500.0,
  "lifetimeEarnings": 0.0,
  "lifetimeSpent": 0.0,
  "score": 0,
  "itemsReturnedCount": 0,
  "foundReportsCount": 0,
  "lostReportsCount": 0
}
```

### Claim Document:

```json
{
  "id": "claim_789",
  "lostReportId": "lost_456",
  "claimerId": "user_finder",
  "claimerMessage": "Found it near the coffee shop on Main St",
  "foundReportId": "found_123",
  "status": "PENDING",
  "rewardAmount": 100.0,
  "rewardPaid": false,
  "ownerResponse": null,
  "createdAt": "2025-12-19T10:00:00Z"
}
```

### Transaction Document:

```json
{
  "id": "trans_999",
  "fromUserId": "user_owner",
  "toUserId": "user_finder",
  "amount": 100.0,
  "type": "REWARD",
  "description": "Reward for finding Laptop",
  "relatedEntityId": "claim_789",
  "relatedEntityType": "CLAIM",
  "createdAt": "2025-12-19T10:30:00Z"
}
```

---

## 🔐 Security Measures

1. **Authentication**: Clerk JWT tokens required for all operations
2. **Authorization**: Only lost item owner can approve claims
3. **Balance Check**: Validates sufficient funds before transfer
4. **Atomic Transactions**: All database operations in @Transactional
5. **Idempotency**: Can't release reward twice (checks rewardPaid flag)
6. **Validation**: Claim must be APPROVED before completing
7. **Audit Trail**: All transactions recorded in database

---

## 📱 Mobile Responsiveness

All pages are fully responsive:

- Notification bell works on mobile
- Claim cards stack on small screens
- Message boxes are scrollable
- Touch-friendly buttons
- Grid layouts adapt to screen size

---

## 🎯 Success Metrics

Track these metrics in MongoDB:

- Total coins in circulation
- Average reward amount
- Claims approval rate
- Average time to approve
- Total transactions
- Top earners (leaderboard)
- Items returned count

---

## 🔮 Future Enhancements

1. **Push Notifications**: Real-time browser/mobile notifications
2. **Email Notifications**: Email when item is claimed
3. **SMS Alerts**: Optional SMS for important updates
4. **In-app Messaging**: Direct chat between owner and finder
5. **Escrow System**: Hold coins in escrow until verification
6. **Dispute Resolution**: Handle disagreements
7. **Rating System**: Rate the exchange experience
8. **Photo Verification**: Require photo proof before reward
9. **GPS Verification**: Verify meeting location
10. **Multi-currency**: Support different coin types

---

## 📝 Summary

✅ **Complete workflow implemented and working:**

1. ✅ Users start with 500 coins
2. ✅ Notification bell shows pending claims
3. ✅ Owner receives real-time notifications
4. ✅ **Owner can read detailed messages from finders**
5. ✅ Owner can approve/reject claims
6. ✅ **Owner can verify and release rewards**
7. ✅ Coins automatically transfer (subtract from owner, add to finder)
8. ✅ Transaction records created
9. ✅ Lifetime statistics updated
10. ✅ Reputation points awarded
11. ✅ All data persisted in MongoDB

The system provides a complete, secure, and user-friendly experience for managing lost and found items with a gamified reward system! 🎉
