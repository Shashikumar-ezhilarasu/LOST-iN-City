# Clerk Authentication & Reward System Setup Guide

This guide explains the new Clerk authentication system and reward/claim functionality that has been added to Lost City.

## 🔑 Features Implemented

### 1. **Clerk Authentication**

- Modern authentication with Clerk (replaces custom JWT)
- Automatic user synchronization via webhooks
- Support for both Clerk and legacy JWT tokens
- User profiles created automatically on first sign-in

### 2. **User Wallet System**

- Each user has a `walletBalance` for receiving rewards
- Track `itemsReturnedCount` for gamification
- Empty `badges` and `skills` arrays on profile creation
- Scores updated based on successful returns

### 3. **Claim & Reward System**

- Finders can claim lost items
- Owners review and approve/reject claims
- Rewards released ONLY when owner confirms
- Transaction history tracked in database

## 📋 Setup Instructions

### Step 1: Install Clerk Package

```bash
npm install @clerk/nextjs
```

### Step 2: Create Clerk Account & Get Keys

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Get your API keys from the Dashboard

### Step 3: Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Clerk Frontend Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# API
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Step 4: Configure Backend

Add to `backend/src/main/resources/application.yml`:

```yaml
clerk:
  secret-key: ${CLERK_SECRET_KEY:}
  publishable-key: ${CLERK_PUBLISHABLE_KEY:}
```

Or set environment variables:

```bash
export CLERK_SECRET_KEY=sk_test_your_secret_key_here
export CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Step 5: Configure Clerk Webhooks

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Subscribe to these events:
   - `user.created`
   - `user.updated`
4. Copy the signing secret (for production verification)

For local development, use [ngrok](https://ngrok.com/):

```bash
ngrok http 8080
# Use the ngrok URL as your webhook endpoint
```

### Step 6: Update User Model in Database

The User model now includes:

- `clerkId` (String, unique, indexed)
- `walletBalance` (Double, default 0.0)
- `badges` (List<String>, empty by default)
- `skills` (List<String>, empty by default)
- `itemsReturnedCount` (Integer, default 0)

**No migration needed** - MongoDB will add fields automatically.

## 🎮 How the Claim/Reward System Works

### 1. **Someone Loses an Item**

- User reports lost item on `/report-lost`
- Sets a `rewardAmount` (optional)
- Item status: `OPEN`

### 2. **Someone Finds the Item**

- Finder sees the lost report
- Clicks "I Found This" button
- Creates a claim with optional message
- Can attach their own found report

### 3. **Owner Reviews Claim**

- Owner sees all claims for their lost items
- Reviews each claim
- Can:
  - **Approve**: Confirms this person found the item
  - **Reject**: Not the right person/item

### 4. **Reward Release**

- After approval, owner clicks "Complete & Release Reward"
- Reward amount is credited to finder's `walletBalance`
- Finder's `itemsReturnedCount` increases
- Finder gains bonus score points
- Lost item status: `CLOSED`
- Transaction record created

### Logic Guarantees:

✅ Only lost item owner can approve/reject claims
✅ Only one claim can be approved per lost item  
✅ Reward released only after owner confirms
✅ Finders cannot claim their own lost items
✅ All transactions logged for auditing

## 📁 New API Endpoints

### Claims

- `POST /api/claims` - Create a claim
- `GET /api/claims/lost-report/{id}` - Get claims for a lost report (owner only)
- `GET /api/claims/my-claims` - Get user's claims (as finder)
- `GET /api/claims/my-lost-items` - Get claims for user's lost items (as owner)
- `GET /api/claims/{id}` - Get specific claim
- `POST /api/claims/{id}/approve` - Approve a claim (owner only)
- `POST /api/claims/{id}/reject` - Reject a claim (owner only)
- `POST /api/claims/{id}/complete` - Release reward (owner only)

### Webhooks

- `POST /api/webhooks/clerk` - Clerk user sync webhook

## 🔧 Frontend Integration

### Using Clerk in Components

```typescript
import { useAuth, useUser } from "@clerk/nextjs";

export default function MyComponent() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Hello {user?.firstName}!</p>
      <p>Clerk ID: {userId}</p>
    </div>
  );
}
```

### Making Authenticated API Calls

```typescript
import { useAuth } from "@clerk/nextjs";
import { claimsAPI } from "@/lib/api";

const { getToken } = useAuth();

// Get Clerk session token
const token = await getToken();

// Make API call (automatically includes token)
const claims = await claimsAPI.getMyClaims();
```

## 🚀 Running the Application

### Start Backend

```bash
cd backend
./start.sh
# Or manually:
# mvn spring-boot:run
```

### Start Frontend

```bash
npm install  # First time only
npm run dev
```

### Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger Docs: http://localhost:8080/swagger-ui.html

## 📊 Database Models

### User

```java
- id: String
- clerkId: String (unique, from Clerk)
- email: String
- displayName: String
- avatarUrl: String
- walletBalance: Double (reward balance)
- badges: List<String> (initially empty)
- skills: List<String> (initially empty)
- itemsReturnedCount: Integer
- score: Integer
```

### Claim

```java
- id: String
- lostReport: LostReport
- foundReport: FoundReport (optional)
- claimer: User (finder)
- owner: User (lost item owner)
- status: PENDING | APPROVED | REJECTED | COMPLETED
- claimerMessage: String
- ownerResponse: String
- rewardAmount: Double
- rewardPaid: Boolean
```

### Transaction

```java
- id: String
- fromUser: User (null for rewards)
- toUser: User
- amount: Double
- type: REWARD | REFUND | ADMIN_CREDIT | ADMIN_DEBIT
- description: String
- relatedClaimId: String
- relatedLostReportId: String
```

## 🐛 Troubleshooting

### "User not found" Error

- Clear browser localStorage
- Sign out and sign in again
- Check if user exists in MongoDB: `db.users.find()`

### Webhook Not Working

- Check ngrok is running for local dev
- Verify webhook URL in Clerk Dashboard
- Check backend logs for webhook errors

### Authentication Failed

- Verify Clerk keys in `.env.local`
- Check Clerk Dashboard for API key status
- Ensure backend has `CLERK_SECRET_KEY` set

### Claims Not Showing

- Verify user is authenticated
- Check user has permission (owner vs claimer)
- Look at backend logs for errors

## 📝 Next Steps

1. **Install dependencies**: `npm install`
2. **Set up Clerk account** and get API keys
3. **Configure environment variables**
4. **Set up webhooks** (for production)
5. **Test the flow**:
   - Sign up with Clerk
   - Report a lost item with reward
   - Sign in as another user
   - Claim the item
   - Approve claim and release reward
   - Check wallet balance

## 🎯 Testing Checklist

- [ ] User can sign up with Clerk
- [ ] User profile created in MongoDB
- [ ] User can report lost item with reward
- [ ] Another user can claim the item
- [ ] Owner can see all claims
- [ ] Owner can approve/reject claims
- [ ] Only one claim can be approved
- [ ] Reward is credited after completion
- [ ] Transaction is recorded
- [ ] Wallet balance updates correctly
- [ ] Cannot claim own lost items
- [ ] Cannot approve claim twice

---

**Need Help?** Check the logs:

- Frontend: Browser console
- Backend: Terminal running `./start.sh`
- MongoDB: `mongosh lostcity` then `db.users.find()`
