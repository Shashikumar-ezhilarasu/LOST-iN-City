# Database Update Guide

## Current Status

- ✅ New users automatically get **1000 coins** (configured in User.java model)
- ✅ Individual users can reset their balance to 1000 using the "Get 1000 Coins" button (if balance < 1000)
- ✅ All coin transactions use proper CRUD operations
- ✅ Complete audit trail via Transaction history

## For Existing Users with Low Balance

### Option 1: Self-Service (RECOMMENDED)

1. Log in to http://localhost:3000
2. Go to Profile page
3. If your balance is below 1000 coins, you'll see a button: **"Get 1000 Coins"**
4. Click it to instantly update your balance to 1000

### Option 2: MongoDB Direct Update (Admin Only)

If you have many existing users to update, use this MongoDB command:

```bash
# Connect to your MongoDB Atlas cluster
mongo "mongodb+srv://shashikumarezhil_db_user:CZHLkjeFvHz55vC5@lostcity.1g3rszx.mongodb.net/lostcity"

# Run this command
db.users.updateMany(
  { coins: { $lt: 1000 } },
  { $set: { coins: 1000.0 } }
)
```

Or use MongoDB Compass:

1. Connect to: `mongodb+srv://shashikumarezhil_db_user:CZHLkjeFvHz55vC5@lostcity.1g3rszx.mongodb.net/lostcity`
2. Go to `lostcity` database → `users` collection
3. Run filter: `{ coins: { $lt: 1000 } }`
4. Update all: `{ $set: { coins: 1000.0 } }`

## How CRUD Operations Work

### Reward Flow (Complete CRUD Example):

1. **CREATE Transaction**

   - When reward is released, two operations happen:
   - Owner: `debitCoins()` - removes coins and creates DEBIT transaction
   - Finder: `creditCoins()` - adds coins and creates CREDIT transaction

2. **READ Operations**

   - `/api/wallet/stats` - Get current balance, lifetime earnings/spent
   - `/api/wallet/transactions` - Get transaction history
   - `/api/wallet/balance` - Get simple balance check

3. **UPDATE Operations**

   - Balance automatically updated when:
     - Releasing rewards (owner loses coins)
     - Receiving rewards (finder gains coins)
     - Adding coins manually
     - Daily bonus claims
   - Lifetime stats also updated (earnings/spent)

4. **DELETE Operations**
   - Transactions are NEVER deleted (audit trail)
   - Balances can only be modified, not deleted
   - User accounts maintain full history

### Transaction Flow:

```
Lost Item Owner (1200 coins)
  ↓ [Sets reward: 300 coins]
  ↓ [Finder claims item]
  ↓ [Owner approves claim]
  ↓ [Owner clicks "Release Reward"]
  ↓
[System executes transferCoins()]
  ├→ Owner: 1200 - 300 = 900 coins (lifetimeSpent += 300)
  └→ Finder: 500 + 300 = 800 coins (lifetimeEarnings += 300)

[Transaction Record Created]
  - Type: REWARD_PAYOUT
  - From: Owner
  - To: Finder
  - Amount: 300
  - Status: COMPLETED
  - Timestamp: 2025-12-19T...
```

## Verification

To verify the system is working:

1. Check your current balance:

   - Go to http://localhost:3000/profile
   - Look at the Wallet Display section

2. Test reward flow:

   - Post a lost item with a reward
   - Have another user claim it
   - Approve the claim
   - Release the reward
   - Check both users' transaction history

3. Verify transactions:
   - Profile page → Transactions tab
   - Should show all coin movements with details

## Important Notes

- The `/api/wallet/admin/update-all-balances` endpoint exists in code but requires backend recompilation
- For immediate needs, use Option 1 (self-service button) or Option 2 (MongoDB direct)
- New users automatically get 1000 coins - no action needed
- All reward transfers are atomic (both sides succeed or both fail)
- Transaction history provides complete audit trail
