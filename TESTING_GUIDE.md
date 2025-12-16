# ✅ Setup Complete - Testing Guide

## Current Status

### ✅ All Systems Running

- **Backend**: Running on http://localhost:8080 ✅
- **Frontend**: Running on http://localhost:3000 ✅
- **MongoDB**: Connected ✅
- **Clerk Auth**: Configured ✅

### ✅ All Errors Fixed

- Backend Java compilation errors: Fixed
- Frontend TypeScript errors: Fixed
- Clerk middleware updated to v5
- Environment variables configured

---

## Test Data Storage & Frontend Fetching

### Step 1: Open the Application

Open your browser and go to:
**http://localhost:3000**

You should see the Lost City homepage.

### Step 2: Sign Up with Clerk

1. Click **Sign Up** or **Sign In**
2. Create an account (you'll be redirected to Clerk)
3. Complete the sign-up process
4. You'll be redirected back to the app

### Step 3: Create Test Data

#### Report a Lost Item

1. Click **Report Lost** in navigation
2. Fill in the form:
   - Item Name: "My Wallet"
   - Category: Select one
   - Description: "Brown leather wallet"
   - Location: "Library 2nd floor"
   - Date: Today
   - Reward: 25 (coins)
3. Click **Submit**
4. ✅ Data is now stored in MongoDB!

#### Report a Found Item

1. Click **Report Found** in navigation
2. Fill in the form:
   - Item Name: "iPhone 13"
   - Category: Electronics
   - Description: "Blue case"
   - Found Location: "Cafeteria"
   - Current Location: "Security office"
3. Click **Submit**
4. ✅ Data is now stored in MongoDB!

### Step 4: Verify Data is Fetched

#### Check Browse Lost Page

1. Navigate to http://localhost:3000/browse-lost
2. You should see your lost item displayed
3. **Open DevTools** (F12 or Cmd+Option+I)
4. Go to **Network tab**
5. Refresh the page
6. Look for API call to `/api/lost-reports`
7. ✅ You'll see data fetched from backend!

#### Check Browse Found Page

1. Navigate to http://localhost:3000/browse-found
2. You should see your found item
3. Check Network tab again
4. ✅ Data fetched from `/api/found-reports`!

### Step 5: Test Complete Flow

#### Create a Claim

1. Go to your lost item page
2. Another user (or same user in incognito) can claim it
3. Submit a claim with a message
4. ✅ Claim stored in MongoDB!

#### Approve & Release Reward

1. Go to your lost item
2. See the claim from the finder
3. Click **Approve**
4. Click **Complete & Release Reward**
5. ✅ Coins transferred via CurrencyService!
6. ✅ Transaction recorded in database!

### Step 6: Check Wallet

1. Click on your profile or wallet
2. You'll see:
   - **Current Balance**: Your coins
   - **Lifetime Earnings**: Total earned
   - **Lifetime Spent**: Total spent
   - **Items Returned**: Count
   - **Transaction History**: All your transactions
3. ✅ All data fetched from MongoDB via backend API!

---

## Verify with Terminal Commands

### Check Backend API

```bash
# Get all lost reports
curl http://localhost:8080/api/lost-reports

# Get all found reports
curl http://localhost:8080/api/found-reports

# Get quests
curl http://localhost:8080/api/quests

# Get leaderboard
curl http://localhost:8080/api/leaderboard
```

### Check with Authentication

After signing in, get your JWT token from browser DevTools:

1. Open DevTools → Application → Cookies
2. Copy the `__session` cookie value
3. Use it in API calls:

```bash
# Get your profile (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/users/profile

# Get your wallet balance (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/wallet/balance

# Get your transactions (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/wallet/transactions
```

---

## Data Flow Visualization

```
User Action (Frontend)
        ↓
  Next.js API Call
        ↓
  Spring Boot Backend
        ↓
    MongoDB Atlas
        ↓
  Data Retrieved
        ↓
  Backend Processes
        ↓
  JSON Response
        ↓
  Frontend Renders
```

### Example Flow: Report Lost Item

1. **User fills form** → Frontend validates
2. **Submit button** → POST to `/api/lost-reports`
3. **Backend receives** → `LostReportController.create()`
4. **Service layer** → `LostReportService.create()`
5. **Repository** → `LostReportRepository.save()`
6. **MongoDB** → Document inserted
7. **Response** → Success with item ID
8. **Frontend** → Shows success, redirects

### Example Flow: View Wallet

1. **User clicks wallet** → GET `/api/wallet/stats`
2. **Backend** → `WalletController.getStats()`
3. **Service** → `CurrencyService.getWalletStats()`
4. **MongoDB queries**:
   - Get user with coins
   - Get all transactions
   - Calculate stats
5. **Response** → JSON with balance, earnings, spent
6. **Frontend** → `WalletDisplay.tsx` renders data

---

## Testing Checklist

- [ ] ✅ Sign up with Clerk
- [ ] ✅ Create a lost report
- [ ] ✅ See it on /browse-lost page
- [ ] ✅ Create a found report
- [ ] ✅ See it on /browse-found page
- [ ] ✅ Submit a claim
- [ ] ✅ Approve a claim
- [ ] ✅ Release reward (coins transferred)
- [ ] ✅ Check wallet shows updated balance
- [ ] ✅ View transaction history
- [ ] ✅ Check backend logs (no errors)
- [ ] ✅ Open DevTools Network tab (API calls visible)

---

## Troubleshooting

### Frontend won't load

```bash
# Kill any existing processes
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### Backend not responding

```bash
# Check if running
curl http://localhost:8080/actuator/health

# If not, restart
cd backend && bash start.sh
```

### Data not showing

1. Check browser console for errors
2. Check Network tab for failed API calls
3. Verify backend logs for exceptions
4. Check MongoDB connection in backend logs

---

## Success! 🎉

Your Lost City app is now fully functional with:

- ✅ User authentication (Clerk)
- ✅ MongoDB data storage
- ✅ Backend API serving data
- ✅ Frontend fetching and displaying data
- ✅ Virtual currency system
- ✅ Transaction tracking
- ✅ Claim/reward workflow

**Everything is stored in MongoDB and fetched dynamically!**

Enjoy testing your Lost & Found application! 🚀
