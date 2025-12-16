# Lost & Found Quest 🏰

A gamified Lost & Found web application with a medieval RPG fantasy theme built with Next.js, Tailwind CSS, Shadcn UI, Spring Boot, and MongoDB.

## 🔥 NEW: Clerk Authentication & Reward System

This application now features a complete reward and claim system:

- ✅ **Clerk Authentication** - Secure, modern OAuth authentication
- ✅ **Wallet System** - Users earn and manage reward money
- ✅ **Claim & Verify System** - Finders claim items, owners verify and release rewards
- ✅ **Transaction History** - Full audit trail of all reward payments
- ✅ **Perfect Logic** - Only owners release rewards, only one claim per item
- ✅ **Badges & Skills** - Empty on signup, earned through achievements

**📚 Documentation:**

- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes ⚡
- **[CLERK_SETUP_GUIDE.md](./CLERK_SETUP_GUIDE.md)** - Complete setup guide 📖
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design & architecture 🏗️
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What's implemented ✅

## 🎯 How It Works

### The Reward Flow

```
1. User A loses phone → Reports it with $50 reward
2. User B finds phone → Claims it with message
3. User A reviews claim → Approves User B's claim
4. User A releases reward → $50 goes to User B's wallet
5. Everyone wins! 🎉
```

### Perfect Logic Guarantees

- ✅ Only the item owner can approve claims
- ✅ Only ONE claim can be approved per item
- ✅ Cannot claim your own lost items
- ✅ Rewards released ONLY when owner confirms
- ✅ All transactions fully tracked

## 🎮 Features

### 🔐 Authentication & Users

- Clerk-powered sign up/sign in
- Auto-created profiles with empty badges/skills
- Wallet balance for rewards
- Track items returned count
- Score and leaderboard rankings

### 💰 Reward System

- Set rewards when reporting lost items
- Claim items you've found
- Owners review and approve claims
- Automatic wallet credits
- Transaction history

### 🎨 UI/UX

- Medieval RPG fantasy theme
- Responsive mobile & desktop
- Real-time updates
- Clean, intuitive interface

### 🏆 Gamification

- Earn XP for returning items
- Unlock badges through achievements
- Add skills to profile
- Compete on leaderboard
- Track humanitarian impact

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.8+
- MongoDB (Atlas or local)
- Clerk account (free at [clerk.com](https://clerk.com))

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Clerk

Get keys from [clerk.com](https://clerk.com) and create `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Start Backend

```bash
cd backend
export CLERK_SECRET_KEY=sk_test_...
./start.sh
```

### 5. Start Frontend

```bash
npm run dev
```

### 6. Visit App

Open http://localhost:3000 and test the flow!

## 📁 Project Structure

```
lostCity/
├── app/                    # Next.js pages
│   ├── browse-lost/       # Browse lost items
│   ├── browse-found/      # Browse found items
│   ├── report-lost/       # Report lost item
│   ├── profile/           # User profile & wallet
│   └── ...
├── components/            # React components
│   ├── ClaimButton.tsx   # For finders
│   ├── ClaimsManager.tsx # For owners
│   └── ...
├── backend/              # Spring Boot API
│   └── src/main/java/com/lostcity/
│       ├── model/        # MongoDB models
│       ├── service/      # Business logic
│       ├── controller/   # REST endpoints
│       └── security/     # Clerk auth
└── lib/                  # Shared utilities
    └── api.ts           # API client
```

## 🔑 Key API Endpoints

### Claims

- `POST /api/claims` - Create claim
- `GET /api/claims/my-claims` - My claims (finder)
- `GET /api/claims/my-lost-items` - Claims on my items (owner)
- `POST /api/claims/{id}/approve` - Approve claim
- `POST /api/claims/{id}/complete` - Release reward

### Lost/Found Items

- `POST /api/lost-reports` - Report lost item
- `GET /api/lost-reports` - Browse lost items
- `POST /api/found-reports` - Report found item
- `GET /api/found-reports` - Browse found items

### Users

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile

### Webhooks

- `POST /api/webhooks/clerk` - Clerk user sync

## 🗄️ Database Models

### User

```javascript
{
  clerkId: "user_...",      // From Clerk
  email: "user@example.com",
  displayName: "John Doe",
  walletBalance: 150.00,     // Reward money
  badges: [],                // Earned achievements
  skills: [],                // User expertise
  itemsReturnedCount: 5,
  score: 850
}
```

### Claim

```javascript
{
  lostReport: ObjectId,
  claimer: ObjectId,          // Finder
  owner: ObjectId,            // Item owner
  status: "PENDING",          // → APPROVED → COMPLETED
  rewardAmount: 50.00,
  rewardPaid: false
}
```

### Transaction

```javascript
{
  toUser: ObjectId,
  amount: 50.00,
  type: "REWARD",
  description: "Reward for finding iPhone"
}
```

## 🧪 Testing the Flow

1. **Sign up** at http://localhost:3000
2. **Report lost item** with $50 reward
3. **Sign in as another user**
4. **Claim the item** with a message
5. **Back to first user** - see claim
6. **Approve claim**
7. **Release reward**
8. **Check wallet** - balance increased! 💰

## 🛠️ Development

### Frontend

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
```

### Backend

```bash
cd backend
./start.sh          # Start Spring Boot
mvn clean install   # Build
mvn test           # Run tests
```

### Database

```bash
mongosh lostcity                              # Connect
db.users.find()                               # View users
db.claims.find({ status: "PENDING" })         # View claims
db.transactions.find()                        # View transactions
```

## 🐛 Troubleshooting

### "User not found" error

Clear browser storage and sign in again

### Clerk imports not found

Run `npm install` to install @clerk/nextjs

### Cannot create claim

Check user is signed in and not claiming own item

### Webhook not working

For local dev, use ngrok: `ngrok http 8080`

## 📚 Learn More

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Spring Boot Guides](https://spring.io/guides)
- [MongoDB Documentation](https://docs.mongodb.com)

## 🤝 Contributing

Contributions welcome! Please read the documentation first:

1. Review [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Check [CLERK_SETUP_GUIDE.md](./CLERK_SETUP_GUIDE.md)
3. Fork the repository
4. Create a feature branch
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Credits

Built with:

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)

---

**Ready to reunite people with their lost items?** 🏰✨

Start by reading [QUICKSTART.md](./QUICKSTART.md) and get running in 5 minutes!
