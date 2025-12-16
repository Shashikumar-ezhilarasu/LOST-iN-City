# Quick Start: Clerk Authentication & Rewards

## 🚀 Installation

```bash
# Install Clerk package
npm install @clerk/nextjs

# Start backend (in backend directory)
./start.sh

# Start frontend (in root directory)
npm run dev
```

## 🔑 Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Get keys from: https://clerk.com → Create app → API Keys

## 📝 Key Features

### ✅ Authentication

- Sign up/in handled by Clerk
- User profiles auto-created in MongoDB
- No passwords to manage

### 💰 Reward System

1. **Lost Item Owner**:

   - Reports lost item with reward amount
   - Reviews claims from finders
   - Approves correct finder
   - Releases reward

2. **Finder**:
   - Submits claim with message
   - Gets reward in wallet when approved
   - Earns badges and points

### 🎯 Perfect Logic

- ✓ Only owner can approve/release reward
- ✓ Only one claim approved per item
- ✓ Cannot claim own items
- ✓ Reward released only after confirmation
- ✓ All transactions tracked

## 🧩 Using in Components

```typescript
import { useAuth } from "@clerk/nextjs";
import { claimsAPI } from "@/lib/api";

// In your component
const { isSignedIn, getToken } = useAuth();

// Make authenticated request
const token = await getToken();
const claims = await claimsAPI.getMyClaims();
```

## 📍 Key API Endpoints

- `POST /api/claims` - Create claim
- `GET /api/claims/my-claims` - My claims (as finder)
- `GET /api/claims/my-lost-items` - Claims on my items
- `POST /api/claims/{id}/approve` - Approve claim
- `POST /api/claims/{id}/complete` - Release reward

## 📊 New Database Fields

**User Model:**

- `clerkId` - Clerk user ID
- `walletBalance` - Reward balance
- `badges` - Achievement badges (empty initially)
- `skills` - User skills (empty initially)
- `itemsReturnedCount` - Successful returns

**New Models:**

- `Claim` - Claim submissions
- `Transaction` - Payment history

## 🎮 Testing Flow

1. Sign up at http://localhost:3000
2. Report lost item with reward ($10)
3. Sign in as different user
4. Claim the item
5. Back to first user - approve claim
6. Complete and release reward
7. Check wallet balance increased

## 📚 Full Documentation

See [CLERK_SETUP_GUIDE.md](./CLERK_SETUP_GUIDE.md) for complete details.

## 🆘 Need Help?

- Frontend errors: Check browser console
- Backend errors: Check terminal logs
- Database: `mongosh lostcity` then `db.users.find()`
- Clerk issues: Check dashboard.clerk.com

---

**Ready to go!** Sign up, test the claim flow, and watch rewards transfer! 🎉
