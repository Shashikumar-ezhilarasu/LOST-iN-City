# 🎁 LostCity Dynamic Reward System Guide

## Overview

The LostCity platform uses a **dynamic reward calculation system** that fairly compensates finders based on multiple factors including item category, time lost, and urgency indicators.

## 📋 Complete Workflow

### 1. **Item Lost**

- Owner reports lost item with details
- Can optionally set a minimum reward amount
- System calculates dynamic reward estimate

### 2. **Item Found**

- Finder discovers the lost item
- Finder reports it as found (optional)
- OR Finder directly creates a claim on the lost item

### 3. **Claim Creation**

- Finder sends claim/match request to lost item owner
- Can attach their found report if they filed one
- Includes message explaining how they found it
- **System calculates dynamic reward at this point**

### 4. **Owner Reviews Claim**

- Owner receives notification of claim
- Reviews finder's message and proof
- Can see all details and photos

### 5. **Owner Approves/Rejects**

- **Approve**: Confirms this person has their item
  - Lost item marked as "MATCHED"
  - Found item (if exists) marked as "MATCHED"
  - No reward transferred yet
- **Reject**: This isn't the right match
  - Claim marked as "REJECTED"
  - Item remains "OPEN" for other claims

### 6. **Owner Completes & Releases Reward**

- After physically receiving the item back
- Owner clicks "Complete & Release Reward"
- **System automatically:**
  - Transfers coins from system to finder's wallet
  - Awards reputation points to finder
  - Increments finder's `itemsReturnedCount`
  - Marks claim as "COMPLETED"
  - Marks lost item as "CLOSED"
  - Creates transaction record

### 7. **Finder Receives Reward**

- Coins added to finder's wallet
- Reputation score increased
- Achievement progress updated
- Can see transaction in profile

## 💰 Dynamic Reward Calculation

### Factors Considered

#### 1. **Base Reward (Category)**

```
Electronics:    $100
Jewelry:        $150
Documents:      $80
Wallet:         $120
Keys:           $50
Phone:          $100
Laptop:         $150
Bag:            $70
Clothing:       $40
Pet:            $200
Vehicle:        $300
Other:          $50
```

#### 2. **Time Factor**

The longer an item has been lost, the higher the reward:

- Same day: 1.0× (no bonus)
- 1-7 days: 1.1× (10% bonus)
- 1-4 weeks: 1.2× (20% bonus)
- 1-3 months: 1.3× (30% bonus)
- 3+ months: 1.5× (50% bonus)

#### 3. **Urgency Factor**

More details indicate higher importance:

- Detailed description (50+ chars): +10%
- Has images: +10%
- Color specified: +5%
- Brand specified: +5%
- Has tags: +10%

**Maximum urgency bonus: +40%**

### Calculation Formula

```
finalReward = MAX(ownerSetReward, dynamicReward)

dynamicReward = baseReward × timeFactor × urgencyFactor

Example:
- Lost Laptop (base: $150)
- Lost 2 weeks ago (time: 1.2×)
- Has description, images, color, brand (urgency: 1.3×)
- Owner set reward: $100

Dynamic calculation: $150 × 1.2 × 1.3 = $234
Final reward: MAX($100, $234) = $234 ✅
```

## ⭐ Reputation Points

Reputation points are awarded alongside coins:

```
Reputation Points = Reward Amount ÷ 10

Example:
$234 reward = 23 reputation points
```

### Reputation Benefits

- Displayed on leaderboard
- Unlocks achievement badges
- Increases trust score
- May unlock premium features

## 🔄 State Transitions

### Lost Item Status

```
OPEN → MATCHED → CLOSED
  ↑       ↓
  └─ REJECTED (back to OPEN)
```

### Claim Status

```
PENDING → APPROVED → COMPLETED
    ↓
REJECTED (final)
```

## 📊 API Endpoints

### Get Reward Breakdown

```http
GET /api/claims/reward-breakdown/:lostReportId

Response:
{
  "baseReward": 150.00,
  "timeFactor": 1.2,
  "urgencyFactor": 1.3,
  "ownerSetReward": 100.00,
  "dynamicCalculation": 234.00,
  "finalReward": 234.00,
  "reputationPoints": 23
}
```

### Create Claim

```http
POST /api/claims
{
  "lost_report_id": "item123",
  "found_report_id": "found456", // optional
  "message": "I found your item at..."
}
```

### Approve Claim

```http
POST /api/claims/:id/approve
{
  "response": "Thank you for finding my item!"
}
```

### Complete and Release Reward

```http
POST /api/claims/:id/complete
```

## 🎯 Best Practices

### For Item Owners

1. **Provide Detailed Information**

   - More details = Higher reward calculation
   - Add multiple photos
   - Specify brand, color, unique features
   - Add relevant tags

2. **Set Minimum Reward (Optional)**

   - System will use higher of your amount or calculated
   - Shows you value your item

3. **Review Claims Quickly**

   - Finders appreciate prompt responses
   - Builds community trust

4. **Release Reward After Receiving Item**
   - Complete transaction promptly
   - Builds your reputation too

### For Finders

1. **Be Honest and Detailed**

   - Explain where/how you found the item
   - Attach photos if possible
   - Provide contact information

2. **Report Found Items**

   - Even without claim, helps the system
   - Increases your visibility

3. **Be Patient**
   - Owners need time to verify
   - Multiple people might claim same item

## 📈 Transaction Records

Every reward release creates a permanent transaction:

```javascript
{
  "type": "REWARD",
  "amount": 234.00,
  "fromUser": null,  // System credit
  "toUser": "finder123",
  "description": "Reward for helping return a lost item",
  "relatedLostReportId": "item123",
  "relatedClaimId": "claim789",
  "status": "COMPLETED",
  "createdAt": "2025-12-17T14:30:00Z"
}
```

## 🔐 Security & Fairness

### Prevents Gaming the System

- ✅ Can't claim your own lost items
- ✅ Must match your found reports to your claims
- ✅ Only owner can approve/reject claims
- ✅ Reward calculated at claim time (no last-minute changes)
- ✅ Transaction records are immutable
- ✅ All actions are logged and auditable

### Fairness Measures

- Transparent reward calculation
- Visible breakdown before claiming
- Higher value items = Higher rewards
- Time-sensitive bonuses encourage quick returns
- Detailed reporting rewarded

## 🎮 Gamification Elements

### Achievements (Future)

- "First Find" - Return your first item
- "Hero of the Month" - Most items returned
- "Speed Demon" - Return item within 24 hours
- "Detail Master" - Perfect reporting score

### Leaderboard

- Ranked by reputation (score)
- Shows items found/returned
- Displays total earnings
- Community recognition

## 🛠 Technical Implementation

### Backend Services

1. **RewardCalculationService**

   - Calculates dynamic rewards
   - Provides breakdown transparency
   - Handles reputation conversion

2. **ClaimService**

   - Manages claim lifecycle
   - Triggers reward release
   - Updates user stats

3. **CurrencyService**
   - Handles coin transactions
   - Records transaction history
   - Maintains wallet balances

### Frontend Components

1. **ClaimsManager**

   - Shows reward breakdown
   - Manages claim actions
   - Real-time status updates

2. **Browse Pages**
   - Display estimated rewards
   - Show item urgency indicators

## 📞 Support & Questions

For questions about rewards:

- Check this guide first
- View reward breakdown for specific items
- Contact support if calculation seems incorrect
- All calculations are logged and reviewable

---

**Remember:** The system is designed to be fair, transparent, and rewarding for both finders and owners. Happy finding! 🎉
