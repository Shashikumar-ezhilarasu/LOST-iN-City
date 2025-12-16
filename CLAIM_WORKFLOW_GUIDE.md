# LostCity - Complete Claim Workflow Testing Guide

## 🎯 Overview

This guide walks through the complete claim and reward workflow in LostCity, from reporting a lost item to receiving the reward.

## 🚀 Complete Workflow

### Step 1: User A Reports a Lost Item

1. **Sign up/Login as User A**

   - Navigate to `/sign-up`
   - Create account (e.g., alice@example.com)
   - Complete signup process

2. **Report Lost Item**
   - Navigate to `/report-lost`
   - Fill in details:
     - Item name: "Brown Leather Wallet"
     - Description: Detailed description with distinguishing features
     - Location: "Central Park, NYC"
     - Date lost
     - **Reward: 500 coins** (important!)
     - Upload images
   - Submit report
   - Backend creates lost report with status "OPEN"

### Step 2: User B Finds and Claims the Item

1. **Sign up/Login as User B** (Different user)

   - Navigate to `/sign-up`
   - Create account (e.g., bob@example.com)
   - Complete signup process

2. **Browse Lost Items**

   - Navigate to `/browse-lost`
   - Find the wallet reported by User A
   - Click to view details

3. **Submit Claim**
   - Click "CLAIM THIS ITEM" button
   - Redirects to `/found-item/claim/[lostItemId]`
   - Fill in claim form:
     - Optional: Link to your found report (if you reported it as found first)
     - Required: Detailed message explaining:
       - Where you found it
       - Specific details matching the description
       - Current location of the item
   - Click "SUBMIT CLAIM"
   - Backend creates claim with status "PENDING"

### Step 3: User A Gets Notified and Reviews Claim

1. **Login as User A** (original owner)
2. **Notification System**

   - Notification bell in header shows red badge with count
   - Click bell to see pending claims
   - Shows: Item name, claimer name, date, preview of message
   - Click to go to lost item detail page

3. **Review Claim on Lost Item Page**
   - Navigate to `/lost-item/[id]`
   - See "CLAIMS" section (only visible to owner)
   - View claim details:
     - Claimer's name
     - Message from claimer
     - Linked found report (if any)
     - Date submitted
4. **Decision Options**

   **Option A: Approve Claim**

   - Add optional response message
   - Click "Approve" button
   - Confirmation dialog appears
   - Backend updates:
     - Claim status → "APPROVED"
     - Lost report status → "MATCHED"
     - Found report status → "MATCHED" (if linked)
   - Cannot approve multiple claims for same item

   **Option B: Reject Claim**

   - Add optional response message
   - Click "Reject" button
   - Confirmation dialog appears
   - Backend updates:
     - Claim status → "REJECTED"
   - Can approve other claims later

### Step 4: Coordinate Exchange (Outside App)

1. **Communication**

   - User A and User B coordinate via:
     - Email (from user profiles)
     - External messaging
     - Phone (if shared)

2. **Meet in Public Place**
   - Safety notice displayed on page
   - Exchange item in safe, public location
   - Verify ownership and item condition

### Step 5: Complete Transaction & Release Reward

1. **User A Confirms Receipt**

   - After successfully receiving the item
   - Login and navigate to `/lost-item/[id]`
   - See approved claim section (blue box)
   - Click "Complete & Release Reward" button
   - Confirmation dialog: "Have you received your item? This will release the reward to the finder. This action cannot be undone."
   - Click confirm

2. **Backend Processing** (Automatic via `ClaimService.completeClaimAndReleaseReward`)

   ```java
   // Check validations
   - Claim must be APPROVED
   - Reward not already paid
   - Lost report reward not already released

   // Execute coin transfer
   - Use CurrencyService.awardItemReward()
   - Transfer reward coins from User A to User B
   - Creates transaction record

   // Update records
   - Claim.status → "COMPLETED"
   - Claim.rewardPaid → true
   - LostReport.status → "CLOSED"
   - LostReport.rewardReleased → true
   - User B: itemsReturnedCount + 1

   // Update User B stats
   - coins += reward amount
   - lifetimeEarnings += reward amount
   - Potential badge unlocks:
     * "First Find" (≥1 found)
     * "Good Samaritan" (≥5 returned)
     * "Treasure Hunter" (≥5000 lifetime)
   - Level calculation (XP/1000 + 1)
   ```

3. **Success Notification**
   - Alert: "🎉 Reward released successfully!"
   - Page refreshes to show updated status

### Step 6: User B Receives Reward

1. **Check Profile Updates**

   - Navigate to `/profile`
   - See updated stats:
     - Coins balance increased
     - Items returned count +1
     - Lifetime earnings increased
     - New badges unlocked (if thresholds met)
     - Potential level up

2. **Transaction History**
   - View in WalletDisplay component
   - Shows: "Item Reward" transaction
   - Amount: +500 coins
   - Type: ITEM_REWARD
   - Reference: Lost report ID

## 📊 System Updates Summary

| Action         | User A (Owner)        | User B (Finder)         | Database                               |
| -------------- | --------------------- | ----------------------- | -------------------------------------- |
| Report Lost    | -500 coins (escrowed) | -                       | LostReport created (OPEN)              |
| Submit Claim   | Notification          | Claim pending           | Claim created (PENDING)                |
| Approve Claim  | Item MATCHED          | Claim approved          | Claim → APPROVED, Reports → MATCHED    |
| Complete & Pay | Item CLOSED           | +500 coins, +1 returned | Claim → COMPLETED, Transaction created |

## 🔔 Notification Features

### Notification Bell (Header)

- Real-time badge showing pending claim count
- Click to see dropdown with pending claims
- Auto-refreshes every 30 seconds
- Shows:
  - Item name
  - Claimer name
  - Message preview
  - Date submitted
- Click to navigate to item detail page

### Email Notifications (Future Enhancement)

- Pending claim submitted
- Claim approved/rejected
- Reward released

## 🎮 Badge System Integration

Badges automatically unlock based on activities:

| Badge           | Unlock Criteria          | Triggered By               |
| --------------- | ------------------------ | -------------------------- |
| First Find      | foundReports.length ≥ 1  | Reporting item as found    |
| First Report    | lostReports.length ≥ 1   | Reporting lost item        |
| Good Samaritan  | itemsReturned ≥ 5        | Completing 5 claims        |
| Treasure Hunter | lifetimeEarnings ≥ 5000  | Earning rewards            |
| Community Hero  | itemsReturned ≥ 10       | Completing 10 claims       |
| Legend          | level ≥ 10               | Earning XP (10,000+ coins) |
| Millionaire     | lifetimeEarnings ≥ 10000 | Total earnings milestone   |

## 🔒 Security & Validations

### Backend Validations

1. **Claim Creation**

   - Cannot claim own lost item
   - Lost item must be OPEN
   - Can only claim with own found reports

2. **Claim Approval**

   - Only owner can approve/reject
   - Claim must be PENDING
   - Only one claim can be approved per item

3. **Reward Release**
   - Claim must be APPROVED
   - Owner must initiate completion
   - Reward can only be paid once
   - Automatic coin transfer via CurrencyService

### Frontend Guards

- Authentication required (Clerk)
- JWT token in all API requests
- Owner-only sections conditionally rendered
- Confirmation dialogs for critical actions

## 🧪 Testing Checklist

### Basic Flow

- [ ] User A can report lost item with reward
- [ ] User B can browse and view lost items
- [ ] User B can submit claim
- [ ] Notification appears for User A
- [ ] User A can approve claim
- [ ] User A can complete and release reward
- [ ] User B receives coins
- [ ] Transaction recorded in history
- [ ] Badges unlock appropriately
- [ ] Level updates based on XP

### Edge Cases

- [ ] Cannot claim own item (validation error)
- [ ] Cannot approve multiple claims (second approval fails)
- [ ] Cannot release reward twice (validation error)
- [ ] Claim shows properly in both users' profiles
- [ ] Status updates propagate correctly
- [ ] Logout works on profile page

### Error Handling

- [ ] Network errors show user-friendly messages
- [ ] Invalid claim IDs handled gracefully
- [ ] Unauthorized access attempts blocked
- [ ] Missing data doesn't crash pages

## 🎨 UI Features

### Claim Status Colors

- 🟡 **PENDING**: Yellow badge/border (needs review)
- 🔵 **APPROVED**: Blue box (waiting for completion)
- ✅ **COMPLETED**: Green (reward paid)
- ❌ **REJECTED**: Red (declined)

### Interactive Elements

- Notification bell with live badge count
- Expandable claim cards
- Response message input
- Approve/Reject buttons
- Complete & Pay button
- Loading states during API calls
- Success/error alerts

## 📱 User Experience Flow

```
[User A]                    [System]                    [User B]
   │                           │                           │
   ├──Report Lost Item─────────>│                           │
   │                           │                           │
   │                           │<────Browse Lost Items─────┤
   │                           │                           │
   │                           │<────Submit Claim──────────┤
   │                           │                           │
   │<────Notification──────────┤                           │
   │                           │                           │
   ├──View & Review Claim──────>│                           │
   │                           │                           │
   ├──Approve Claim────────────>│────Notification──────────>│
   │                           │                           │
   ├──[Physical Exchange]──────────[Meet & Verify]─────────┤
   │                           │                           │
   ├──Complete & Pay───────────>│                           │
   │                           │                           │
   │                           ├──Transfer Coins───────────>│
   │                           │                           │
   │                           ├──Update Stats─────────────>│
   │                           │                           │
   │                           ├──Unlock Badges────────────>│
   │                           │                           │
   │                           │                           ├──View Profile
   │                           │                           │
   └─[Item Closed]             └─[Transaction Complete]     └─[Reward Received]
```

## 🔧 API Endpoints Used

| Endpoint                        | Method | Purpose                                 |
| ------------------------------- | ------ | --------------------------------------- |
| `/api/lost-reports`             | POST   | Create lost report                      |
| `/api/lost-reports/{id}`        | GET    | Get lost report details                 |
| `/api/lost-reports/my-reports`  | GET    | Get my lost reports                     |
| `/api/found-reports/my-reports` | GET    | Get my found reports                    |
| `/api/claims`                   | POST   | Submit claim                            |
| `/api/claims/lost-report/{id}`  | GET    | Get claims for lost report (owner only) |
| `/api/claims/my-lost-items`     | GET    | Get claims on my items                  |
| `/api/claims/{id}/approve`      | POST   | Approve claim                           |
| `/api/claims/{id}/reject`       | POST   | Reject claim                            |
| `/api/claims/{id}/complete`     | POST   | Complete & release reward               |
| `/api/users/profile`            | GET    | Get user profile                        |

## 🎯 Success Metrics

After completing the workflow, verify:

1. ✅ User B's coin balance increased by reward amount
2. ✅ User B's itemsReturnedCount incremented
3. ✅ User B's lifetimeEarnings updated
4. ✅ Transaction recorded with correct amounts
5. ✅ Lost report status = CLOSED
6. ✅ Claim status = COMPLETED
7. ✅ Badges unlocked if thresholds met
8. ✅ Level updated if XP threshold crossed
9. ✅ Notification badge cleared for User A
10. ✅ Both users can view transaction in history

## 🛠️ Troubleshooting

### Issue: Notification not showing

- Check: User is logged in as owner
- Check: Claims exist with PENDING status
- Check: API endpoint returns data
- Check: Token is valid

### Issue: Cannot approve claim

- Check: User is the owner
- Check: Claim status is PENDING
- Check: No other claims already approved

### Issue: Reward not transferred

- Check: Claim is APPROVED first
- Check: Backend CurrencyService is working
- Check: User has not already completed

### Issue: Coins not showing in profile

- Check: Profile page fetches latest user data
- Check: Token includes updated user info
- Refresh page to fetch latest stats

## 🚀 Quick Start Testing

```bash
# Terminal 1: Start backend
cd backend
./start.sh

# Terminal 2: Start frontend
npm run dev

# Browser 1: User A
# - Go to http://localhost:3000
# - Sign up as alice@example.com
# - Report lost wallet with 500 coin reward

# Browser 2 (Incognito): User B
# - Go to http://localhost:3000
# - Sign up as bob@example.com
# - Browse lost items, find wallet
# - Submit claim

# Browser 1: User A
# - Check notification bell (should show badge)
# - Click to see claim
# - Review and approve
# - Complete exchange (simulate)
# - Click "Complete & Release Reward"

# Browser 2: User B
# - Check profile
# - Verify coins increased by 500
# - Check badges for any new unlocks
# - View transaction history
```

---

## ✨ New Features Implemented

1. **Logout Button**: Added to profile page with Clerk SignOutButton
2. **Notification Bell**: Real-time pending claim notifications in header
3. **Claim Management UI**: Complete approval/rejection interface on lost item page
4. **Claim Submission**: Dedicated claim page with form
5. **Coin Transfer Logic**: Automatic reward transfer via backend
6. **Transaction Tracking**: Full history in WalletDisplay
7. **Badge System**: Dynamic unlock based on achievements
8. **Status Indicators**: Visual feedback for all claim states

This workflow ensures a seamless, secure, and rewarding experience for both lost item owners and finders!
