# 🏰 Lost & Found Quest - Complete Documentation

A comprehensive gamified Lost & Found web application with a medieval RPG fantasy theme. Help reunite people with their lost belongings while earning rewards, achievements, and climbing the leaderboard!

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Frontend Features](#frontend-features)
- [Backend Features](#backend-features)
- [API Documentation](#api-documentation)
- [Dynamic Reward System](#dynamic-reward-system)
- [Gamification System](#gamification-system)
- [User Workflows](#user-workflows)
- [Database Schema](#database-schema)
- [Security](#security)
- [Contributing](#contributing)

---

## 🎯 Overview

Lost & Found Quest is a humanitarian platform that gamifies the process of reuniting people with their lost belongings. The application combines practical lost-and-found functionality with engaging RPG-style gamification to encourage community participation.

### How It Works

1. **Report Lost Items**: Users report lost items with photos, descriptions, and set rewards
2. **Find & Match**: Finders discover items and submit claims to owners
3. **Verify Ownership**: Owners review claims and verify the rightful finder
4. **Release Rewards**: Upon successful return, coins and reputation points are automatically transferred
5. **Level Up**: Users earn XP, unlock achievements, and compete on leaderboards

---

## ✨ Key Features

### 🎮 Gamification System

- **Coins & XP**: Earn virtual currency and experience points for helping others
- **Level System**: Progress through levels based on accumulated XP
- **Achievements**: Unlock badges for milestones (First Find, Helper Hero, Guardian Angel, etc.)
- **Leaderboard**: Compete with other users in real-time rankings
- **Daily Quests**: Complete challenges for bonus rewards
- **Profile Statistics**: Track items returned, people helped, and lifetime earnings

### 💰 Dynamic Reward System

- **Smart Calculation**: Rewards adjust based on item category, time lost, and urgency
- **Time Bonuses**: Up to 50% bonus for items lost longer
- **Urgency Factors**: Up to 40% bonus for detailed reports
- **Transparent Breakdown**: Users see how rewards are calculated
- **Reputation Points**: Earn points alongside coins (1 point per $10)

### 🔐 Security & Authentication

- **Clerk Authentication**: Secure OAuth-based login with social providers
- **JWT Integration**: Backend validates Clerk tokens for API security
- **Role-Based Access**: User roles and permissions management
- **Secure Endpoints**: Protected routes requiring authentication

### 📱 User Experience

- **Medieval RPG Theme**: Rich brown and gold color palette with fantasy elements
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-time Notifications**: Bell icon with live claim updates
- **Intuitive Navigation**: Bottom navigation bar for easy access
- **Image Upload**: Photo support for lost and found items
- **Search & Filter**: Advanced filtering by category, location, date

### 🔄 Complete Claim Workflow

- **Claim Submission**: Finders submit claims with evidence
- **Owner Review**: Owners get notifications and review claims
- **Approve/Reject**: Binary decision with optional feedback
- **Automatic Transfers**: Coins and reputation awarded automatically
- **Transaction History**: Complete audit trail of all rewards

---

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 14.2.0 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Shadcn UI + Radix UI
- **Icons**: Lucide React
- **Authentication**: Clerk Next.js 5.0.0
- **State Management**: React 18 with hooks

### Backend

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: MongoDB 7.0 (via Spring Data MongoDB)
- **Security**: Spring Security + JWT (0.12.3)
- **API Documentation**: Springdoc OpenAPI 2.3.0
- **Build Tool**: Maven 3.x
- **Utilities**: Lombok

### Infrastructure

- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: Clerk (Cloud)
- **Hosting**: Ready for Vercel (Frontend) + any Java hosting (Backend)

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Next.js Frontend                     │
│  (TypeScript, Tailwind, Shadcn UI, Clerk Auth)          │
└───────────────────┬──────────────────────────────────────┘
                    │
                    │ REST API Calls
                    │ (JWT Bearer Token)
                    │
┌───────────────────▼──────────────────────────────────────┐
│                   Spring Boot Backend                    │
│   (Java 17, JWT Validation, Business Logic)             │
└───────────────────┬──────────────────────────────────────┘
                    │
                    │ MongoDB Queries
                    │
┌───────────────────▼──────────────────────────────────────┐
│                    MongoDB Atlas                         │
│     (Users, Items, Claims, Transactions, Quests)        │
└──────────────────────────────────────────────────────────┘

                External Services:
                ┌─────────────┐
                │  Clerk Auth │  (OAuth, User Management)
                └─────────────┘
```

### Design Pattern

- **Frontend**: Component-based architecture with server and client components
- **Backend**: Layered architecture (Controller → Service → Repository)
- **API**: RESTful endpoints with standardized response format
- **Security**: JWT-based stateless authentication

---

## 🚀 Getting Started

### Prerequisites

**Frontend:**

- Node.js 18.x or higher
- npm or yarn

**Backend:**

- Java 17 or higher (Java 21 recommended)
- Maven 3.6+
- MongoDB Atlas account (or local MongoDB)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Shashikumar-ezhilarasu/lostCity.git
cd lostCity
```

#### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

#### 3. Backend Setup

```bash
cd backend

# Configure MongoDB connection
# Edit src/main/resources/application.yml
# Add your MongoDB Atlas connection string

# Build the project
mvn clean install

# Run the backend
./start.sh
# OR
mvn spring-boot:run
```

Backend will run on: **http://localhost:8080**

#### 4. Database Setup

The application uses MongoDB Atlas. Create collections:

- `users`
- `lost_reports`
- `found_reports`
- `claims`
- `transactions`
- `quests`
- `achievements`

Seed data scripts are available:

```bash
# Insert mock data
./seed-mongodb-fixed.js
```

---

## 🎨 Frontend Features

### Pages

#### 1. **Landing Page** (`/`)

- Hero section with call-to-action
- "How It Works" guide
- Feature highlights
- Sign up prompt

#### 2. **Dashboard** (`/quests`)

- Welcome banner with daily reward
- Quick action buttons
- Daily quests with progress tracking
- Leaderboard preview (Top 5)
- Recent activity feed

#### 3. **Report Lost Item** (`/report-lost`)

- Photo upload with preview
- Category selection
- Location picker with map
- Reward amount setting
- Detailed description field
- Contact information

#### 4. **Report Found Item** (`/report-found`)

- Similar to lost item form
- Optional category matching
- Where/when found details
- Photo evidence upload

#### 5. **Browse Lost Items** (`/browse-lost`)

- Grid/list view toggle
- Filter by category, date, location
- Search functionality
- Reward amount display
- Status indicators (OPEN, MATCHED, CLOSED)

#### 6. **Browse Found Items** (`/browse-found`)

- Similar filtering to lost items
- Match suggestions
- Claim count display

#### 7. **Lost Item Details** (`/lost-item/[id]`)

- Full item information
- Photo gallery
- Location map
- **For Owners:**
  - Claims management section
  - Approve/Reject buttons
  - Response message input
  - "Complete & Release Reward" button
  - Status tracking
- **For Others:**
  - "Claim This Item" button
  - Reward breakdown display

#### 8. **Found Item Details** (`/found-item/[id]`)

- Item information
- Finder contact
- Match suggestions
- Claim status

#### 9. **Claim Submission** (`/found-item/claim/[lostItemId]`)

- Link to found report (optional)
- Detailed message field
- Reward preview
- "What Happens Next" explainer

#### 10. **User Profile** (`/profile`)

- Avatar and display name
- Level and XP progress bar
- Coins balance
- Statistics dashboard:
  - Items returned
  - People helped
  - Lifetime earnings
  - Success rate
- Badges showcase
- Transaction history
- Logout button

#### 11. **Leaderboard** (`/leaderboard`)

- Real-time rankings
- Filter by timeframe (Weekly, Monthly, All-time)
- User stats display
- Highlight current user's rank
- Top 3 special styling

#### 12. **Quests** (`/quests`)

- Daily quest cards
- Progress bars
- Reward preview
- Quest descriptions
- Completion status

### Components

#### Core Components

- **Header**: Logo, navigation, notification bell, user menu
- **BottomNav**: Mobile-friendly navigation bar
- **NotificationBell**: Live claim count with dropdown preview
- **WalletDisplay**: Coins balance with animation
- **ClaimsManager**: Complete claim approval/rejection UI
- **TransactionHistory**: List of coin transfers
- **ClaimButton**: Reusable claim submission trigger

#### UI Components (Shadcn)

- Button, Card, Avatar
- Progress bars
- Dropdown menus
- Dialog modals
- Form inputs

### Styling

- **Color Palette**:
  - Deep Browns: `#2e1a0f`, `#4a2e1b`
  - Rich Golds: `#f4c430`, `#c79b00`
  - Creamy Beige: `#eaddca`
- **Fonts**:
  - Primary: Cinzel (serif)
  - Titles: MedievalSharp
- **Effects**:
  - Gold borders with border-radius
  - 3D button effects
  - Shadow depth
  - Hover animations

---

## 🔧 Backend Features

### Core Services

#### 1. **UserService**

- User registration and profile management
- Clerk ID integration
- Wallet balance management
- Statistics calculation
- Achievement tracking

#### 2. **LostReportService**

- Create lost item reports
- Search and filter lost items
- Update item status (OPEN → MATCHED → CLOSED)
- Owner verification
- Reward management

#### 3. **FoundReportService**

- Create found item reports
- Search and filter found items
- Match suggestions algorithm
- Status updates

#### 4. **ClaimService**

- Claim creation and validation
- Owner approval/rejection
- Dynamic reward calculation
- Automatic coin transfer on completion
- Status transitions (PENDING → APPROVED → COMPLETED)
- Transaction record creation

#### 5. **CurrencyService**

- Coin balance management
- Transaction logging
- Debit/Credit operations
- Balance validation
- Transaction history retrieval

#### 6. **RewardCalculationService** ⭐

- **Dynamic reward calculation**:
  - Base reward by category
  - Time factor (up to 50% bonus)
  - Urgency factor (up to 40% bonus)
- Reputation point conversion
- Transparent breakdown API
- Owner minimum vs. dynamic comparison

#### 7. **AchievementService**

- Achievement unlock logic
- Badge assignment
- Progress tracking
- Notification triggers

#### 8. **QuestService**

- Daily quest generation
- Progress tracking
- Completion rewards
- Reset logic

#### 9. **LeaderboardService**

- Real-time ranking calculation
- Score aggregation
- Time-based filtering
- Pagination support

### Security Services

#### 10. **JwtService**

- Clerk JWT validation
- Token parsing
- Claims extraction
- Authentication middleware

#### 11. **SecurityConfig**

- Endpoint protection
- CORS configuration
- Public/protected routes
- JWT filter chain

---

## 📡 API Documentation

### Base URL

```
http://localhost:8080/api
```

### Authentication

All protected endpoints require Bearer token:

```
Authorization: Bearer <clerk_jwt_token>
```

### Endpoints

#### Authentication & Users

```http
POST   /auth/register          # Register new user (auto-created via Clerk)
GET    /api/users/me           # Get current user profile
PATCH  /api/users/me           # Update current user
GET    /api/users/{id}         # Get user by ID
PUT    /api/users/profile      # Update display name
```

#### Lost Items

```http
POST   /api/lost-reports                    # Report lost item
GET    /api/lost-reports                    # List/search lost items
GET    /api/lost-reports/{id}               # Get lost item details
PUT    /api/lost-reports/{id}               # Update lost item
DELETE /api/lost-reports/{id}               # Delete lost item
GET    /api/lost-reports/user/{userId}      # Get user's lost reports
```

#### Found Items

```http
POST   /api/found-reports                   # Report found item
GET    /api/found-reports                   # List/search found items
GET    /api/found-reports/{id}              # Get found item details
PUT    /api/found-reports/{id}              # Update found item
DELETE /api/found-reports/{id}              # Delete found item
```

#### Claims

```http
POST   /api/claims                          # Create new claim
GET    /api/claims                          # List all claims (filtered)
GET    /api/claims/{id}                     # Get claim details
GET    /api/claims/lost-report/{id}         # Get claims for lost item
POST   /api/claims/{id}/approve             # Approve claim
POST   /api/claims/{id}/reject              # Reject claim
POST   /api/claims/{id}/complete            # Complete & release reward
GET    /api/claims/reward-breakdown/{id}    # Get reward calculation
```

#### Currency & Transactions

```http
GET    /api/currency/balance                # Get user balance
GET    /api/currency/transactions           # Get transaction history
POST   /api/currency/debit                  # Debit coins (admin)
POST   /api/currency/credit                 # Credit coins (admin)
```

#### Quests

```http
GET    /api/quests/daily                    # Get today's quests
POST   /api/quests/{id}/complete            # Complete quest
GET    /api/quests/user                     # Get user quest progress
```

#### Leaderboard

```http
GET    /api/leaderboard                     # Get leaderboard
GET    /api/leaderboard/rank/{userId}       # Get user rank
```

### Response Format

#### Success Response

```json
{
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100
  },
  "errors": []
}
```

#### Error Response

```json
{
  "data": null,
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Item description is required",
      "field": "description"
    }
  ]
}
```

---

## 💎 Dynamic Reward System

### How It Works

The platform uses an intelligent reward calculation system that ensures fair compensation for finders.

### Calculation Formula

```
finalReward = MAX(ownerSetReward, dynamicReward)

dynamicReward = baseReward × timeFactor × urgencyFactor
```

### 1. Base Reward (By Category)

| Category    | Base Reward |
| ----------- | ----------- |
| Pet         | $200        |
| Vehicle     | $300        |
| Jewelry     | $150        |
| Laptop      | $150        |
| Wallet      | $120        |
| Electronics | $100        |
| Phone       | $100        |
| Documents   | $80         |
| Bag         | $70         |
| Keys        | $50         |
| Clothing    | $40         |
| Other       | $50         |

### 2. Time Factor

| Time Lost  | Multiplier | Bonus |
| ---------- | ---------- | ----- |
| Same day   | 1.0×       | 0%    |
| 1-7 days   | 1.1×       | 10%   |
| 1-4 weeks  | 1.2×       | 20%   |
| 1-3 months | 1.3×       | 30%   |
| 3+ months  | 1.5×       | 50%   |

### 3. Urgency Factor

Bonuses for detailed reports:

- ✅ Detailed description (50+ chars): +10%
- ✅ Has images: +10%
- ✅ Color specified: +5%
- ✅ Brand specified: +5%
- ✅ Has tags: +10%

**Maximum urgency bonus: +40%**

### Example Calculation

```
Lost Item: Laptop
Category Base: $150
Time Lost: 2 weeks → 1.2× multiplier
Report Details: Description + Images + Color + Brand → 1.35× multiplier
Owner Set Reward: $100

Dynamic Calculation:
$150 × 1.2 × 1.35 = $243

Final Reward:
MAX($100, $243) = $243 ✅
```

### Reputation Points

```
Reputation Points = Reward Amount ÷ 10

Example: $243 reward = 24 reputation points
```

### Transparency

Users can view the complete breakdown:

- Base reward explanation
- Time bonus calculation
- Urgency bonus factors
- Final reward determination

API endpoint: `GET /api/claims/reward-breakdown/{lostReportId}`

---

## 🎮 Gamification System

### Level System

Users progress through levels based on XP:

```
Level 1: 0-99 XP (Novice)
Level 2: 100-299 XP (Explorer)
Level 3: 300-599 XP (Adventurer)
Level 4: 600-999 XP (Hero)
Level 5: 1000+ XP (Legend)
```

XP is earned by:

- Returning items: +50 XP
- Reporting found items: +20 XP
- Completing quests: +10-50 XP
- Receiving positive feedback: +5 XP

### Achievement Badges

| Badge           | Requirement                     |
| --------------- | ------------------------------- |
| First Find      | Return first item               |
| Helper Hero     | Return 5 items                  |
| Guardian Angel  | Return 10 items                 |
| Speed Demon     | Return item within 24 hours     |
| Consistent      | 7-day streak                    |
| Treasure Hunter | Find item worth 100+ coins      |
| Popular         | Receive 10+ claims on your item |

### Daily Quests

Examples:

- "Report a Found Item" - Reward: 20 coins
- "Browse Lost Items" - Reward: 10 coins
- "Update Your Profile" - Reward: 15 coins
- "Help 2 People Today" - Reward: 50 coins

Quests reset daily at midnight.

### Leaderboard

Rankings based on:

1. **Primary**: Total score (reputation points)
2. **Secondary**: Items returned count
3. **Tertiary**: Join date (older users rank higher)

Timeframes:

- Weekly (last 7 days)
- Monthly (last 30 days)
- All-time

---

## 🔄 User Workflows

### Workflow 1: Reporting a Lost Item

```
1. User clicks "Report Lost Item"
2. Fills form:
   - Upload photo
   - Select category
   - Enter description
   - Set location
   - Set reward amount (optional)
3. Submits form
4. Backend:
   - Creates lost_report
   - Calculates estimated dynamic reward
   - Sets status to OPEN
5. Item appears in browse list
6. User gets notification when claims arrive
```

### Workflow 2: Finding and Claiming an Item

```
1. Finder discovers item
2. Option A: Reports as found item (optional)
3. Browses lost items
4. Finds matching lost item
5. Clicks "Claim This Item"
6. Fills claim form:
   - Links found report (optional)
   - Explains how/where found
7. Submits claim
8. Backend:
   - Creates claim record
   - Calculates dynamic reward
   - Sets status to PENDING
9. Owner gets notification
```

### Workflow 3: Claim Approval & Reward Release

```
OWNER SIDE:
1. Sees notification bell (badge count)
2. Clicks notification or goes to item detail
3. Reviews claim details:
   - Finder's message
   - Proof/photos
   - Reward amount
4. Option A: Clicks "Approve"
   - Item status → MATCHED
   - Claim status → APPROVED
   - Owner writes optional response
5. Physically meets finder and receives item
6. Clicks "Complete & Release Reward"

BACKEND (Automatic):
7. Validates claim is APPROVED
8. Calculates reputation points
9. Awards coins to finder
10. Awards reputation points to finder
11. Increments finder's itemsReturnedCount
12. Creates transaction record
13. Updates claim status → COMPLETED
14. Updates item status → CLOSED
15. Sets rewardPaid = true

FINDER SIDE:
16. Receives coins in wallet
17. Receives reputation points
18. May unlock achievements
19. May level up
20. Sees transaction in profile
21. Leaderboard rank updates
```

### Workflow 4: Claim Rejection

```
1. Owner reviews claim
2. Determines it's not a match
3. Clicks "Reject"
4. Writes reason (optional)
5. Backend:
   - Updates claim status → REJECTED
   - Item remains OPEN
   - Owner can still review other claims
6. Finder is notified
```

---

## 💾 Database Schema

### Collections

#### 1. `users`

```javascript
{
  _id: ObjectId,
  clerkId: String,               // Clerk authentication ID
  email: String,
  displayName: String,
  avatarUrl: String,
  phone: String,
  bio: String,
  walletBalance: Number,         // Current coins
  lifetimeEarnings: Number,      // Total coins ever earned
  itemsReturnedCount: Number,    // Items successfully returned
  reputationScore: Number,       // Total reputation points
  level: Number,                 // User level (1-5+)
  xp: Number,                    // Experience points
  badges: [String],              // Achievement badges
  role: String,                  // USER, ADMIN
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. `lost_reports`

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,              // Electronics, Wallet, Pet, etc.
  images: [String],              // URLs
  color: String,
  brand: String,
  tags: [String],
  rewardAmount: Number,          // Owner-set reward
  latitude: Number,
  longitude: Number,
  locationDescription: String,
  status: String,                // OPEN, MATCHED, CLOSED
  reportedBy: DBRef(users),      // Owner
  approvedClaimId: ObjectId,     // After approval
  rewardReleased: Boolean,       // After completion
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. `found_reports`

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  images: [String],
  foundAt: Date,
  latitude: Number,
  longitude: Number,
  locationDescription: String,
  status: String,                // OPEN, MATCHED, CLOSED
  reportedBy: DBRef(users),      // Finder
  matchedLostItemId: ObjectId,
  createdAt: Date
}
```

#### 4. `claims`

```javascript
{
  _id: ObjectId,
  lostReport: DBRef(lost_reports),
  foundReport: DBRef(found_reports), // Optional
  claimer: DBRef(users),            // Finder
  owner: DBRef(users),              // Lost item owner
  status: String,                   // PENDING, APPROVED, REJECTED, COMPLETED
  claimerMessage: String,
  ownerResponse: String,
  rewardAmount: Number,             // Dynamic calculated amount
  rewardPaid: Boolean,
  reputationAwarded: Number,
  createdAt: Date,
  approvedAt: Date,
  completedAt: Date
}
```

#### 5. `transactions`

```javascript
{
  _id: ObjectId,
  user: DBRef(users),
  amount: Number,
  type: String,                  // REWARD, QUEST_COMPLETION, ADMIN_CREDIT
  description: String,
  relatedClaimId: ObjectId,
  relatedQuestId: ObjectId,
  balanceBefore: Number,
  balanceAfter: Number,
  createdAt: Date
}
```

#### 6. `quests`

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  type: String,                  // DAILY, WEEKLY
  rewardCoins: Number,
  rewardXP: Number,
  requirement: Object,           // Quest-specific requirements
  validFrom: Date,
  validUntil: Date,
  createdAt: Date
}
```

#### 7. `user_quest_progress`

```javascript
{
  _id: ObjectId,
  user: DBRef(users),
  quest: DBRef(quests),
  progress: Number,
  completed: Boolean,
  completedAt: Date
}
```

#### 8. `achievements`

```javascript
{
  _id: ObjectId,
  code: String,                  // FIRST_FIND, HELPER_HERO, etc.
  name: String,
  description: String,
  icon: String,
  requirement: Object
}
```

---

## 🔐 Security

### Authentication Flow

```
1. User signs in with Clerk (Google, GitHub, Email)
2. Clerk returns JWT token
3. Frontend includes token in API requests:
   Authorization: Bearer <token>
4. Backend JwtAuthenticationFilter intercepts
5. JwtService validates token with Clerk
6. Extracts clerkId and user info
7. Loads user from database
8. Sets SecurityContext
9. Request proceeds to controller
```

### Protected Endpoints

All `/api/**` endpoints except:

- `/api/auth/**` - Public authentication endpoints
- `/swagger-ui/**` - API documentation
- `/api-docs/**` - OpenAPI specification

### Security Features

- **JWT Validation**: Verifies Clerk-issued tokens
- **CORS**: Configured for frontend origin
- **HTTPS**: Recommended for production
- **Input Validation**: Bean validation on DTOs
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Content Security Policy headers
- **Rate Limiting**: (Recommended to implement)

---

## 🧪 Testing

### Frontend Testing

```bash
# Run development server
npm run dev

# Test specific features
- Sign in/Sign out
- Report lost item
- Browse items
- Submit claim
- Approve/reject claim
- Complete reward
- Check profile updates
```

### Backend Testing

```bash
# Run unit tests
mvn test

# Test API endpoints
./test-api.sh

# Test data flow
./test-data-flow.sh
```

### Manual Testing Guide

See [CLAIM_WORKFLOW_GUIDE.md](CLAIM_WORKFLOW_GUIDE.md) for step-by-step testing instructions.

---

## 📊 Project Status

### ✅ Completed Features

- ✅ Frontend UI with medieval theme
- ✅ Clerk authentication integration
- ✅ All major pages (dashboard, browse, profile, etc.)
- ✅ Lost/Found item reporting
- ✅ Complete claim workflow
- ✅ Dynamic reward calculation
- ✅ Automatic coin transfer
- ✅ Reputation point system
- ✅ Notification system
- ✅ Transaction history
- ✅ Leaderboard
- ✅ User profile with stats
- ✅ Backend API with MongoDB
- ✅ JWT security
- ✅ API documentation

### 🚧 Potential Enhancements

- [ ] Real-time chat between owner and finder
- [ ] Push notifications (web/mobile)
- [ ] Email notifications
- [ ] Payment gateway integration (Stripe)
- [ ] Image compression and CDN
- [ ] Advanced search with ML matching
- [ ] Mobile apps (React Native)
- [ ] Admin dashboard
- [ ] Analytics and insights
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

**Frontend:**

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind utility classes
- Components in PascalCase
- Async operations with proper error handling

**Backend:**

- Follow Java naming conventions
- Use Lombok to reduce boilerplate
- Write meaningful service methods
- Document complex logic
- Handle exceptions properly

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

- **Developer**: Shashikumar Ezhilarasu
- **Repository**: [github.com/Shashikumar-ezhilarasu/lostCity](https://github.com/Shashikumar-ezhilarasu/lostCity)

---

## 📞 Support

For questions or issues:

- Open an issue on GitHub
- Email: support@lostcityquest.com (placeholder)

---

## 🙏 Acknowledgments

- **Clerk** for authentication services
- **MongoDB Atlas** for database hosting
- **Shadcn UI** for beautiful components
- **Spring Boot** community for excellent documentation
- **Next.js** team for the amazing framework

---

## 📚 Additional Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed architecture overview
- [REWARD_SYSTEM_GUIDE.md](REWARD_SYSTEM_GUIDE.md) - Reward calculation details
- [CLAIM_WORKFLOW_GUIDE.md](CLAIM_WORKFLOW_GUIDE.md) - Testing guide
- [FEATURES_SUMMARY.md](FEATURES_SUMMARY.md) - Feature implementation summary
- [BACKEND_REQUIREMENTS.md](BACKEND_REQUIREMENTS.md) - Backend API specifications

---

<div align="center">

**Made with ❤️ for reuniting people with their belongings**

⭐ Star this repo if you find it useful!

</div>
