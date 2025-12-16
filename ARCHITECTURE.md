# Architecture Overview: Clerk Auth + Reward System

## System Components

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Next.js App   │──────│  Clerk Auth  │──────│  Lost City API  │
│   (Frontend)    │      │   (OAuth)    │      │    (Backend)    │
└─────────────────┘      └──────────────┘      └─────────────────┘
         │                                               │
         │                                               │
         └───────────────────┬───────────────────────────┘
                             │
                        ┌────▼─────┐
                        │ MongoDB  │
                        │ Database │
                        └──────────┘
```

## Database Schema

### Collections

#### 1. **users**

```javascript
{
  _id: ObjectId,
  clerkId: "user_abc123",        // From Clerk
  email: "user@example.com",
  displayName: "John Doe",
  avatarUrl: "https://...",
  walletBalance: 150.00,          // Reward balance
  badges: [],                     // Empty initially
  skills: [],                     // Empty initially
  itemsReturnedCount: 5,
  score: 850,
  role: "USER",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

#### 2. **lost_reports**

```javascript
{
  _id: ObjectId,
  title: "Lost iPhone 13",
  description: "...",
  category: "Electronics",
  rewardAmount: 50.00,            // Set by owner
  latitude: 37.7749,
  longitude: -122.4194,
  status: "OPEN",                 // OPEN → MATCHED → CLOSED
  reportedBy: DBRef(users),       // Owner
  approvedClaimId: "claim_xyz",   // After approval
  rewardReleased: false,          // After completion
  createdAt: ISODate
}
```

#### 3. **found_reports**

```javascript
{
  _id: ObjectId,
  title: "Found iPhone",
  description: "...",
  category: "Electronics",
  status: "OPEN",                 // OPEN → MATCHED → CLOSED
  reportedBy: DBRef(users),       // Finder
  matchedLostItemId: "lost_abc",  // After matching
  createdAt: ISODate
}
```

#### 4. **claims** (NEW)

```javascript
{
  _id: ObjectId,
  lostReport: DBRef(lost_reports),
  foundReport: DBRef(found_reports), // Optional
  claimer: DBRef(users),            // Finder
  owner: DBRef(users),              // Lost item owner
  status: "PENDING",                // PENDING → APPROVED → COMPLETED
  claimerMessage: "I found it at...",
  ownerResponse: "Thank you!",
  rewardAmount: 50.00,
  rewardPaid: false,
  createdAt: ISODate,
  approvedAt: ISODate,
  completedAt: ISODate
}
```

#### 5. **transactions** (NEW)

```javascript
{
  _id: ObjectId,
  fromUser: null,                   // null = system/owner
  toUser: DBRef(users),             // Recipient
  amount: 50.00,
  type: "REWARD",                   // REWARD, REFUND, ADMIN_CREDIT
  description: "Reward for finding iPhone",
  relatedClaimId: "claim_xyz",
  relatedLostReportId: "lost_abc",
  createdAt: ISODate
}
```

## User Journey Flow

### Flow 1: Someone Loses an Item

```
User A signs in with Clerk
    ↓
Creates lost report
    ↓
Sets reward: $50
    ↓
Status: OPEN
    ↓
Waiting for claims...
```

### Flow 2: Someone Finds the Item

```
User B signs in with Clerk
    ↓
Browses lost items
    ↓
Sees User A's lost item
    ↓
Clicks "I Found This"
    ↓
Submits claim with message
    ↓
Claim status: PENDING
```

### Flow 3: Owner Reviews & Approves

```
User A checks "My Lost Items"
    ↓
Sees claim from User B
    ↓
Reviews message
    ↓
Clicks "Approve"
    ↓
Claim status: APPROVED
Lost report status: MATCHED
```

### Flow 4: Reward Release

```
User A clicks "Complete & Release Reward"
    ↓
Confirmation dialog
    ↓
System processes:
  1. User B.walletBalance += $50
  2. User B.itemsReturnedCount += 1
  3. User B.score += bonus points
  4. Transaction record created
  5. Claim.rewardPaid = true
  6. Claim.status = COMPLETED
  7. Lost report status = CLOSED
    ↓
User B receives notification
💰 Reward credited!
```

## Security Rules

### Authorization Matrix

| Action                        | Who Can Do It                         |
| ----------------------------- | ------------------------------------- |
| Create lost report            | Any authenticated user                |
| Create claim                  | Any authenticated user (except owner) |
| View all claims for lost item | Owner only                            |
| Approve/reject claim          | Owner only                            |
| Release reward                | Owner only (after approval)           |
| View claim details            | Owner or claimer only                 |
| View own wallet               | Owner only                            |
| View transaction history      | Involved users only                   |

### Business Logic Constraints

```java
// 1. Cannot claim own lost item
if (lostReport.reportedBy.id == currentUser.id) {
    throw new RuntimeException("Cannot claim own item");
}

// 2. Can only approve one claim per lost item
List<Claim> approved = claims.findByStatusAndLostReport(APPROVED, lostReport);
if (!approved.isEmpty()) {
    throw new RuntimeException("Already approved another claim");
}

// 3. Reward released only once
if (lostReport.rewardReleased) {
    throw new RuntimeException("Reward already released");
}

// 4. Must be approved before completion
if (claim.status != APPROVED) {
    throw new RuntimeException("Must approve before completing");
}
```

## API Request/Response Examples

### Create Claim

```http
POST /api/claims
Authorization: Bearer <clerk_jwt_token>
Content-Type: application/json

{
  "lost_report_id": "abc123",
  "found_report_id": "def456",  // optional
  "message": "I found this at Central Park today"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "claim_xyz",
    "status": "PENDING",
    "rewardAmount": 50.00,
    ...
  }
}
```

### Approve Claim

```http
POST /api/claims/claim_xyz/approve
Authorization: Bearer <clerk_jwt_token>
Content-Type: application/json

{
  "response": "Thank you so much for finding it!"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "claim_xyz",
    "status": "APPROVED",
    ...
  }
}
```

### Complete & Release Reward

```http
POST /api/claims/claim_xyz/complete
Authorization: Bearer <clerk_jwt_token>

Response 200:
{
  "success": true,
  "data": {
    "id": "claim_xyz",
    "status": "COMPLETED",
    "rewardPaid": true,
    ...
  }
}
```

## Frontend Components

### Component Structure

```
components/
├── ClaimButton.tsx          # For finders to claim items
├── ClaimsManager.tsx        # For owners to manage claims
├── WalletDisplay.tsx        # Show user wallet balance
└── TransactionHistory.tsx   # Show transaction log
```

### Integration Example

```tsx
// In lost-item/[id]/page.tsx
import ClaimButton from "@/components/ClaimButton";
import ClaimsManager from "@/components/ClaimsManager";
import { useUser } from "@clerk/nextjs";

export default function LostItemPage({ params }) {
  const { user } = useUser();
  const isOwner = lostItem.reportedBy.clerkId === user?.id;

  return (
    <div>
      <h1>{lostItem.title}</h1>

      {isOwner ? (
        <ClaimsManager lostReportId={params.id} />
      ) : (
        <ClaimButton
          lostReportId={params.id}
          rewardAmount={lostItem.rewardAmount}
        />
      )}
    </div>
  );
}
```

## Clerk Integration Points

### 1. Authentication

- Sign up/in handled by Clerk
- JWT token issued by Clerk
- Backend verifies token

### 2. User Sync (Webhook)

```
Clerk Event: user.created
    ↓
POST /api/webhooks/clerk
    ↓
Create user in MongoDB:
{
  clerkId: event.data.id,
  email: event.data.email,
  displayName: event.data.firstName,
  walletBalance: 0,
  badges: [],
  skills: []
}
```

### 3. Making Authenticated Requests

```typescript
const { getToken } = useAuth();
const token = await getToken();

// Token is automatically included by apiFetch
const data = await claimsAPI.getMyClaims();
```

## Error Handling

### Common Errors & Solutions

| Error                     | Cause                                | Solution                    |
| ------------------------- | ------------------------------------ | --------------------------- |
| "User not found"          | Token valid but no DB record         | Sign out and sign in again  |
| "Cannot claim own item"   | User trying to claim their lost item | Prevented by business logic |
| "Already approved"        | Multiple claims approved             | Only first can be approved  |
| "Reward already released" | Trying to release twice              | Check claim status          |
| Authentication failed     | Invalid/expired token                | Refresh token or re-login   |

## Performance Considerations

- **Indexing**: `clerkId`, `email` are indexed
- **DBRef**: Used for relationships (lazy loading)
- **Pagination**: All list endpoints support pagination
- **Caching**: Consider Redis for frequently accessed data
- **Webhooks**: Async processing for user sync

## Future Enhancements

1. **Badge System**: Auto-award badges based on achievements
2. **Skill Tags**: Allow users to add expertise areas
3. **Reputation Score**: Calculate based on successful returns
4. **Escrow System**: Hold rewards in escrow until item returned
5. **Dispute Resolution**: Admin panel for disputed claims
6. **Push Notifications**: Real-time alerts for claim updates
7. **Photo Verification**: Require proof photos from finders
8. **Rating System**: Rate finders and owners
9. **Withdrawal System**: Cash out wallet balance
10. **Analytics Dashboard**: Track reward statistics

---

**Architecture designed for:**

- ✅ Security first
- ✅ Clear business logic
- ✅ Scalability
- ✅ User trust
- ✅ Easy debugging
