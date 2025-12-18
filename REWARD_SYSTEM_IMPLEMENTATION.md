# Reward System Implementation - Complete Flow

## Overview

The reward system implements peer-to-peer coin transfers from item owners to finders upon verified return of lost items.

## Complete Workflow

### 1. Claim Creation (ClaimService.createClaim)

```java
- User (claimer) claims a lost item
- Dynamic reward is calculated using RewardCalculationService
- Claim status set to PENDING
- Reward amount stored in claim
```

### 2. Owner Approval (ClaimService.approveClaim)

```java
- Owner reviews claim and approves it
- Claim status changes: PENDING → APPROVED
- Lost report status changes: OPEN → MATCHED
- No coins transferred yet (waiting for physical item return)
```

### 3. Reward Release (ClaimService.completeClaimAndReleaseReward)

```java
- Owner confirms physical receipt of item
- System performs reward transfer:

  Step 1: Balance Validation
  - Check owner has sufficient coins
  - Throw error if insufficient

  Step 2: Coin Transfer (CurrencyService.transferCoins)
  - Deduct coins from owner's wallet
  - Add coins to finder's wallet
  - Update lifetimeSpent for owner
  - Update lifetimeEarnings for finder
  - Create transaction record

  Step 3: Reputation Points
  - Calculate reputation: coins / 10
  - Add to finder's score

  Step 4: Statistics Update
  - Increment finder's itemsReturnedCount
  - Save user records

  Step 5: Status Updates
  - Claim status: APPROVED → COMPLETED
  - Set rewardPaid = true
  - Lost report status: MATCHED → CLOSED
  - Set rewardReleased = true
```

## Key Classes & Methods

### ClaimService

- `createClaim()` - Create claim with calculated reward
- `approveClaim()` - Owner approves claim
- `completeClaimAndReleaseReward()` - Transfer coins and complete

### CurrencyService

- `transferCoins(fromUser, toUser, amount, type, description)`
  - Validates amount > 0
  - Checks sufficient balance
  - Prevents self-transfer
  - Deducts from sender
  - Credits to receiver
  - Creates transaction record
  - Updates lifetime stats

### RewardCalculationService

- `calculateReward(LostReport)` - Dynamic calculation
- `calculateReputationPoints(amount)` - Reputation from coins

## Transaction Record

```java
Transaction {
  fromUser: owner (who lost item)
  toUser: claimer (who found item)
  amount: calculated reward
  type: REWARD
  status: COMPLETED
  description: "Reward for returning: {itemTitle}"
  relatedClaimId: claim reference
}
```

## Validation & Error Handling

### Balance Check

```java
if (owner.getCoins() < rewardAmount) {
  throw RuntimeException("Insufficient coins. You have X but need Y. Please add more coins.")
}
```

### Claim Status Validation

```java
if (claim.getStatus() != APPROVED) {
  throw RuntimeException("Claim must be approved before releasing reward")
}

if (claim.getRewardPaid()) {
  throw RuntimeException("Reward has already been paid")
}
```

### Lost Report Validation

```java
if (lostReport.getRewardReleased()) {
  throw RuntimeException("Reward has already been released")
}
```

## Database Updates (Atomic)

All operations wrapped in `@Transactional`:

1. User balance updates (both owner and finder)
2. User statistics updates
3. Transaction record creation
4. Claim status update
5. Lost report status update

## Frontend Integration

### Owner Flow

```
1. Go to lost item detail page
2. Review pending claims
3. Click "Approve" on correct claim
4. Physically meet finder and receive item
5. Click "Complete & Release Reward"
6. System automatically transfers coins
```

### Finder Flow

```
1. Claim lost item
2. Wait for owner approval
3. Arrange meetup with owner
4. Return item physically
5. Owner releases reward
6. Receive coins and reputation automatically
```

## Example Transaction

```
Item: Lost Laptop
Owner: Alice (has 1000 coins)
Finder: Bob (has 200 coins)
Calculated Reward: 250 coins
Reputation: 25 points (250 / 10)

Before:
- Alice: 1000 coins, 500 lifetime spent
- Bob: 200 coins, 300 lifetime earnings, 5 items returned, 50 score

After Transfer:
- Alice: 750 coins, 750 lifetime spent
- Bob: 450 coins, 550 lifetime earnings, 6 items returned, 75 score

Transaction:
- From: Alice
- To: Bob
- Amount: 250 coins
- Type: REWARD
- Status: COMPLETED
```

## Security Features

1. **Authentication Required**: All endpoints require JWT token
2. **Authorization Checks**:
   - Only owner can approve/complete claims
   - Only claimer can view their claims
3. **Atomic Transactions**: All database updates in single transaction
4. **Balance Validation**: Cannot transfer more than available
5. **Duplicate Prevention**:
   - Cannot pay reward twice
   - Cannot complete same claim multiple times

## API Endpoints

```
POST /api/claims - Create claim
POST /api/claims/{id}/approve - Approve claim (owner only)
POST /api/claims/{id}/complete - Complete & release reward (owner only)
GET /api/claims/my-lost-items - Get claims for your lost items
GET /api/currency/transactions - View transaction history
GET /api/currency/balance - Check current balance
```

## Reward Calculation

See `RewardCalculationService` for details:

- Base reward by category
- Time factor multiplier (up to 50% bonus)
- Urgency factor (up to 40% bonus)
- Final = MAX(owner set amount, calculated amount)

## Success Indicators

✅ Owner coins decreased by reward amount
✅ Finder coins increased by reward amount
✅ Finder reputation points increased
✅ Finder items returned count incremented
✅ Transaction record created
✅ Claim marked as COMPLETED
✅ Lost report marked as CLOSED
✅ Lifetime statistics updated correctly

## Common Issues & Solutions

### Issue: Insufficient Balance

**Error**: "You have X coins but need Y"
**Solution**: Owner needs to add more coins via `/api/wallet/add-coins`

### Issue: Claim Already Processed

**Error**: "This claim has already been processed"
**Solution**: Check claim status - may already be approved/rejected

### Issue: Reward Already Paid

**Error**: "Reward has already been paid"
**Solution**: Cannot pay twice - transaction already complete

## Testing Checklist

- [ ] Create claim with calculated reward
- [ ] Owner approves claim
- [ ] Check owner has sufficient balance
- [ ] Complete claim and release reward
- [ ] Verify coin transfer (owner -> finder)
- [ ] Verify reputation points awarded
- [ ] Verify statistics updated
- [ ] Verify transaction record created
- [ ] Verify claim status = COMPLETED
- [ ] Verify lost report status = CLOSED
- [ ] Try to pay twice (should fail)
- [ ] Test insufficient balance scenario
