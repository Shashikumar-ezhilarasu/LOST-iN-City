# LostCity Backend - Complete Technical Documentation

## 🏗️ Architecture Overview

**Technology Stack:**

- **Framework:** Spring Boot 3.2.1
- **Language:** Java 17
- **Database:** MongoDB Atlas
- **Authentication:** JWT + Clerk Authentication
- **Build Tool:** Maven
- **API Documentation:** OpenAPI (Swagger)

---

## 📁 Project Structure

```
backend/
├── src/main/java/com/lostcity/
│   ├── LostCityApplication.java       # Main Spring Boot application entry point
│   ├── config/                        # Configuration classes
│   │   ├── SecurityConfig.java        # Spring Security & CORS configuration
│   │   ├── MongoConfig.java          # MongoDB configuration & custom converters
│   │   └── FoundReportConditionConverter.java
│   ├── controller/                    # REST API Controllers
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── LostReportController.java
│   │   ├── FoundReportController.java
│   │   ├── ClaimController.java
│   │   ├── QuestController.java
│   │   ├── WalletController.java
│   │   ├── LeaderboardController.java
│   │   ├── WebhookController.java
│   │   └── UtilityController.java
│   ├── model/                         # MongoDB Document Models
│   │   ├── User.java
│   │   ├── LostReport.java
│   │   ├── FoundReport.java
│   │   ├── Claim.java
│   │   ├── Transaction.java
│   │   ├── Quest.java
│   │   ├── UserQuest.java
│   │   ├── Comment.java
│   │   └── MatchRequest.java
│   ├── repository/                    # MongoDB Repositories
│   │   ├── UserRepository.java
│   │   ├── LostReportRepository.java
│   │   ├── FoundReportRepository.java
│   │   ├── ClaimRepository.java
│   │   ├── TransactionRepository.java
│   │   ├── QuestRepository.java
│   │   ├── UserQuestRepository.java
│   │   └── CommentRepository.java
│   ├── service/                       # Business Logic Services
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── LostReportService.java
│   │   ├── FoundReportService.java
│   │   ├── ClaimService.java
│   │   ├── CurrencyService.java
│   │   ├── RewardCalculationService.java
│   │   ├── QuestService.java
│   │   ├── LeaderboardService.java
│   │   └── CommentService.java
│   ├── security/                      # Security Components
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── ClerkTokenVerifier.java
│   │   └── CustomUserDetailsService.java
│   ├── dto/                          # Data Transfer Objects
│   │   ├── request/                  # Request DTOs
│   │   └── response/                 # Response DTOs
│   └── exception/                    # Exception Handlers
│       └── GlobalExceptionHandler.java
└── src/main/resources/
    └── application.yml               # Application configuration
```

---

## ⚙️ Configuration (application.yml)

```yaml
spring:
  application:
    name: lost-city-backend
  data:
    mongodb:
      uri: mongodb+srv://username:password@cluster.mongodb.net/lostcity
      database: lostcity

server:
  port: 8080

jwt:
  secret: your-256-bit-secret-key
  expiration: 86400000 # 24 hours

clerk:
  publishable-key: ${CLERK_PUBLISHABLE_KEY}

cors:
  allowed-origins: http://localhost:3000,http://localhost:3001
```

### Key Environment Variables:

- `JWT_SECRET`: Secret key for JWT token generation
- `CLERK_PUBLISHABLE_KEY`: Clerk authentication publishable key
- MongoDB connection string embedded in application.yml

---

## 🗄️ MongoDB Connection & Configuration

### Connection Setup

**File:** `MongoConfig.java`

**Key Components:**

1. **EnableMongoAuditing:** Automatic timestamp management
2. **Custom Converters:**
   - `OffsetDateTimeReadConverter`: Converts MongoDB Date → Java OffsetDateTime
   - `OffsetDateTimeWriteConverter`: Converts Java OffsetDateTime → MongoDB Date
   - `FoundReportConditionConverter`: Custom enum converter

**Database Collections:**

- `users` - User accounts and profiles
- `lost_reports` - Lost item reports
- `found_reports` - Found item reports
- `claims` - Claims linking finders to owners
- `transactions` - Coin transactions
- `quests` - Available quests
- `user_quests` - User quest progress
- `comments` - Comments on reports

### Document Relationships

Uses `@DBRef` for relationships between documents:

```java
@DBRef
private User reportedBy;  // Reference to User document
```

---

## 🔐 Security Architecture

### Authentication Flow

**File:** `SecurityConfig.java`, `JwtAuthenticationFilter.java`, `JwtTokenProvider.java`

#### 1. Dual Authentication Support

- **JWT Authentication** (Legacy)
- **Clerk Authentication** (Primary)

#### 2. Security Filter Chain Process:

```
Request → JwtAuthenticationFilter → SecurityFilterChain → Controller
```

**JwtAuthenticationFilter Steps:**

1. Extract token from `Authorization: Bearer <token>` header
2. Validate token with `JwtTokenProvider` or `ClerkTokenVerifier`
3. Load user details from database
4. Set authentication in SecurityContext

#### 3. Public Endpoints (No Auth Required):

- `POST /api/auth/**` - Registration & login
- `POST /api/webhooks/**` - Clerk webhooks
- `GET /api/lost-reports/**` - Browse lost items
- `GET /api/found-reports/**` - Browse found items
- `GET /api/quests` - View quests
- `GET /api/leaderboard` - View leaderboard
- Swagger documentation endpoints

#### 4. Protected Endpoints:

All other endpoints require valid JWT token

#### 5. CORS Configuration:

```java
Allowed Origins: localhost:3000, localhost:3001, localhost:3002
Allowed Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Allowed Headers: *
Credentials: true
```

---

## 📡 API Endpoints Documentation

### Base URL: `http://localhost:8080`

---

## 1️⃣ Authentication Endpoints

### 🔹 Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "displayName": "John Doe",
      "coins": 1000.0,
      "role": "USER"
    }
  }
}
```

**Process Flow:**

1. `AuthController.register()` receives request
2. `AuthService.register()` validates and creates user
3. Password hashed with BCrypt
4. User saved to MongoDB with default 1000 coins
5. JWT token generated by `JwtTokenProvider`
6. Returns token + user data

**Files Involved:**

- Controller: `AuthController.java`
- Service: `AuthService.java`
- Model: `User.java`
- Repository: `UserRepository.java`

---

### 🔹 Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

**Process Flow:**

1. `AuthController.login()` receives credentials
2. `AuthService.login()` validates credentials
3. Uses `AuthenticationManager` to authenticate
4. Generates JWT token
5. Returns token + user data

---

## 2️⃣ User Management Endpoints

### 🔹 Get Current User

**Endpoint:** `GET /api/users/me`
**Auth:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "displayName": "John Doe",
    "avatarUrl": "https://...",
    "coins": 1250.5,
    "score": 450,
    "badges": ["First Report", "Helper"],
    "foundReportsCount": 5,
    "lostReportsCount": 2,
    "itemsReturnedCount": 3
  }
}
```

**Process Flow:**

1. `JwtAuthenticationFilter` extracts user from token
2. `UserController.getCurrentUser()` called
3. `UserService.getCurrentUserResponse()` fetches user from SecurityContext
4. Converts `User` model to `UserResponse` DTO
5. Returns user data

**Variables Used:**

- `SecurityContextHolder.getContext().getAuthentication()` - Gets authenticated user

---

### 🔹 Update Profile

**Endpoint:** `PUT /api/users/profile`
**Auth:** Required

**Request Body:**

```json
{
  "displayName": "Jane Doe"
}
```

**Process Flow:**

1. Extract current user from SecurityContext
2. Update user's displayName
3. Save to MongoDB
4. Return updated user response

---

### 🔹 Get User by ID

**Endpoint:** `GET /api/users/{id}`
**Auth:** Required

**Path Variable:** `id` - User ID

---

## 3️⃣ Lost Report Endpoints

### 🔹 Create Lost Report

**Endpoint:** `POST /api/lost-reports`
**Auth:** Required

**Request Body:**

```json
{
  "title": "Lost iPhone 14 Pro",
  "description": "Black iPhone 14 Pro, cracked screen",
  "category": "Phone",
  "images": ["https://...", "https://..."],
  "tags": ["black", "cracked", "case"],
  "color": "Black",
  "brand": "Apple",
  "rewardAmount": 150.0,
  "latitude": 37.7749,
  "longitude": -122.4194,
  "locationName": "Golden Gate Park",
  "lostAt": "2024-01-15T10:30:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Lost iPhone 14 Pro",
    "status": "OPEN",
    "rewardAmount": 150.0,
    "reportedBy": {...},
    "createdAt": "2024-01-20T15:30:00Z"
  }
}
```

**Process Flow:**

1. `LostReportController.createLostReport()` receives request
2. Validates request with `@Valid` annotation
3. `LostReportService.createLostReport()` processes:
   - Creates `LostReport` model
   - Sets `reportedBy` to current user
   - Sets initial status to `OPEN`
   - Increments user's `lostReportsCount`
4. Saves to MongoDB via `LostReportRepository`
5. Returns `LostReportResponse` DTO

**Variables Used:**

- `status`: OPEN, MATCHED, CLOSED
- `visibility`: PUBLIC, PRIVATE
- `rewardReleased`: Boolean tracking if reward paid

---

### 🔹 Search Lost Reports

**Endpoint:** `GET /api/lost-reports`
**Auth:** Public (No auth required)

**Query Parameters:**

- `q` (optional) - Search query
- `category` (optional) - Filter by category
- `status` (optional) - Filter by status (OPEN, MATCHED, CLOSED)
- `page` (default: 1) - Page number
- `pageSize` (default: 20) - Items per page
- `sort` (optional) - Sort order

**Response:**

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 45
  }
}
```

**Process Flow:**

1. `LostReportController.searchLostReports()` receives query params
2. `LostReportService.searchLostReports()` builds MongoDB query:
   - Text search on title/description if `q` provided
   - Filter by category, status
   - Apply pagination with `Pageable`
3. Returns `Page<LostReportResponse>`

**MongoDB Query Example:**

```java
Query query = new Query();
if (q != null) query.addCriteria(Criteria.where("title").regex(q, "i"));
if (category != null) query.addCriteria(Criteria.where("category").is(category));
query.with(PageRequest.of(page - 1, pageSize));
```

---

### 🔹 Get Lost Report by ID

**Endpoint:** `GET /api/lost-reports/{id}`
**Auth:** Public

**Path Variable:** `id` - Lost report ID

---

### 🔹 Get My Lost Reports

**Endpoint:** `GET /api/lost-reports/my-reports`
**Auth:** Required

**Process Flow:**

1. Gets current user from SecurityContext
2. Queries MongoDB: `findByReportedBy(currentUser)`
3. Returns user's lost reports

---

### 🔹 Add Comment to Lost Report

**Endpoint:** `POST /api/lost-reports/{id}/comments`
**Auth:** Required

**Request Body:**

```json
{
  "content": "I think I saw this near the library!"
}
```

**Process Flow:**

1. Creates `Comment` with type `LOST`
2. Links comment to lost report ID
3. Saves to `comments` collection

---

### 🔹 Get Comments for Lost Report

**Endpoint:** `GET /api/lost-reports/{id}/comments`
**Auth:** Public

---

## 4️⃣ Found Report Endpoints

### 🔹 Create Found Report

**Endpoint:** `POST /api/found-reports`
**Auth:** Required

**Request Body:**

```json
{
  "title": "Found iPhone",
  "description": "Black iPhone with cracked screen",
  "category": "Phone",
  "images": ["https://..."],
  "foundCondition": "WORN",
  "foundAt": "2024-01-16T14:00:00Z",
  "locationName": "Golden Gate Park - Near Carousel"
}
```

**Found Condition Enum:**

- `NEW` - Like new condition
- `GOOD` - Good condition
- `WORN` - Shows wear
- `DAMAGED` - Damaged

**Process Flow:**
Similar to Lost Report creation but:

- Uses `FoundReport` model
- No reward amount field
- Includes `foundCondition` field
- Increments user's `foundReportsCount`

---

### 🔹 Search Found Reports

**Endpoint:** `GET /api/found-reports`
**Auth:** Public

Same query parameters as lost reports search.

---

### 🔹 Get Found Report by ID

**Endpoint:** `GET /api/found-reports/{id}`
**Auth:** Public

---

### 🔹 Get My Found Reports

**Endpoint:** `GET /api/found-reports/my-reports`
**Auth:** Required

---

### 🔹 Comment Endpoints

Same as lost reports:

- `POST /api/found-reports/{id}/comments`
- `GET /api/found-reports/{id}/comments`

---

## 5️⃣ Claim Management Endpoints

Claims connect finders with owners to facilitate item return and reward payment.

### 🔹 Create Claim

**Endpoint:** `POST /api/claims`
**Auth:** Required

**Request Body:**

```json
{
  "lost_report_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "found_report_id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "message": "I found your iPhone at Golden Gate Park!"
}
```

**Process Flow:**

1. `ClaimController.createClaim()` receives request
2. `ClaimService.createClaim()` validates:
   - Lost report exists and status is OPEN
   - Claimer is not the owner
   - Found report belongs to claimer (if provided)
3. `RewardCalculationService.calculateReward()` calculates reward:
   - Uses owner's set `rewardAmount` from lost report
   - Default minimum: 50 coins if not set
4. Creates `Claim` model:
   - Sets claimer (finder)
   - Sets owner (person who lost item)
   - Links lost and found reports
   - Sets status to PENDING
   - Stores calculated reward amount
5. Saves to MongoDB

**Claim Status Enum:**

- `PENDING` - Awaiting owner review
- `APPROVED` - Owner confirmed
- `REJECTED` - Owner rejected
- `COMPLETED` - Reward paid, item returned

**Variables Used:**

```java
private String id;
private LostReport lostReport;      // @DBRef
private FoundReport foundReport;    // @DBRef (optional)
private User claimer;               // @DBRef (finder)
private User owner;                 // @DBRef (lost item owner)
private ClaimStatus status;
private String claimerMessage;
private String ownerResponse;
private Double rewardAmount;
private Boolean rewardPaid;
```

---

### 🔹 Get Claims for Lost Report

**Endpoint:** `GET /api/claims/lost-report/{lostReportId}`
**Auth:** Required (Owner only)

**Process Flow:**

1. Validates current user is the owner of lost report
2. Queries: `claimRepository.findByLostReportOrderByCreatedAtDesc(lostReport)`
3. Returns all claims for that lost report

---

### 🔹 Get My Claims

**Endpoint:** `GET /api/claims/my-claims`
**Auth:** Required

Returns claims where current user is the claimer (finder).

---

### 🔹 Get Claims for My Lost Items

**Endpoint:** `GET /api/claims/my-lost-items`
**Auth:** Required

Returns claims where current user is the owner.

---

### 🔹 Get Claim by ID

**Endpoint:** `GET /api/claims/{id}`
**Auth:** Required

---

### 🔹 Approve Claim

**Endpoint:** `POST /api/claims/{id}/approve`
**Auth:** Required (Owner only)

**Request Body:**

```json
{
  "response": "Yes! This is definitely my phone. Thank you!"
}
```

**Process Flow:**

1. `ClaimService.approveClaim()` validates:
   - Current user is owner
   - Claim status is PENDING
2. Updates claim:
   - Sets status to APPROVED
   - Stores owner's response message
   - Sets `approvedAt` timestamp
3. Updates lost report:
   - Sets status to MATCHED
   - Links `matchedFoundItemId`
   - Links `approvedClaimId`
4. If found report exists:
   - Updates status to MATCHED
5. Saves all updates

**Files Involved:**

- `ClaimService.java` - Business logic
- `ClaimRepository.java` - Database operations

---

### 🔹 Reject Claim

**Endpoint:** `POST /api/claims/{id}/reject`
**Auth:** Required (Owner only)

**Request Body:**

```json
{
  "response": "Sorry, this doesn't look like my item."
}
```

**Process Flow:**
Similar to approve but:

- Sets status to REJECTED
- Sets `rejectedAt` timestamp
- Does NOT update report statuses

---

### 🔹 Complete Claim & Release Reward

**Endpoint:** `POST /api/claims/{id}/complete`
**Auth:** Required (Owner only)

**Process Flow:**

1. `ClaimService.completeClaimAndReleaseReward()` validates:
   - Claim is APPROVED
   - Reward not already paid
   - Owner has sufficient coins
2. **Currency Transfer:**
   - `CurrencyService.transferCoins()` called
   - Deducts coins from owner
   - Credits coins to claimer (finder)
   - Creates transaction record
3. Updates claim:
   - Sets status to COMPLETED
   - Sets `rewardPaid` to true
4. Updates lost report:
   - Sets status to CLOSED
   - Sets `rewardReleased` to true
5. Increments user stats:
   - Owner's `lifetimeSpent`
   - Claimer's `lifetimeEarnings`, `itemsReturnedCount`

**Transaction Creation:**

```java
Transaction transaction = Transaction.builder()
    .fromUser(owner)
    .toUser(claimer)
    .amount(rewardAmount)
    .type(TransactionType.REWARD_PAYMENT)
    .status(TransactionStatus.COMPLETED)
    .description("Reward for returning: " + lostReport.getTitle())
    .metadata("{\"claimId\":\"" + claimId + "\"}")
    .build();
```

---

### 🔹 Get Reward Breakdown

**Endpoint:** `GET /api/claims/reward-breakdown/{lostReportId}`
**Auth:** Required

Shows how reward is calculated for a lost report.

**Response:**

```json
{
  "success": true,
  "data": {
    "baseReward": 100.0,
    "category": "Phone",
    "ownerSetReward": 150.0,
    "finalReward": 150.0,
    "factors": {
      "timeFactor": 1.0,
      "urgencyFactor": 1.2
    }
  }
}
```

**Process Flow:**

1. `RewardCalculationService.getRewardBreakdown()` calculates:
   - Base reward by category (from `CATEGORY_BASE_REWARDS` map)
   - Time factor (longer lost = higher reward)
   - Urgency factor (more details = higher urgency)
   - **BUT**: Returns owner's set amount as final reward

---

## 6️⃣ Wallet & Currency Endpoints

### 🔹 Get Wallet Balance

**Endpoint:** `GET /api/wallet/balance`
**Auth:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "balance": 1250.5,
    "coins": 1250.5
  }
}
```

**Process Flow:**

1. Gets current user from SecurityContext
2. Returns `user.getCoins()`

---

### 🔹 Get Wallet Stats

**Endpoint:** `GET /api/wallet/stats`
**Auth:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "balance": 1250.5,
    "lifetimeEarnings": 2000.0,
    "lifetimeSpent": 750.0,
    "totalTransactions": 15
  }
}
```

**Process Flow:**

1. `CurrencyService.getWalletStats()` aggregates:
   - Current balance from user
   - Lifetime earnings from user
   - Lifetime spent from user
   - Transaction count from `transactionRepository`

---

### 🔹 Get Transaction History

**Endpoint:** `GET /api/wallet/transactions`
**Auth:** Required

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "type": "REWARD_PAYMENT",
      "amount": 150.0,
      "fromUser": {...},
      "toUser": {...},
      "description": "Reward for returning: Lost iPhone",
      "status": "COMPLETED",
      "createdAt": "2024-01-20T15:30:00Z"
    }
  ]
}
```

**Transaction Types:**

```java
enum TransactionType {
    REWARD_PAYMENT,    // Reward for finding item
    TIP,              // User-to-user tip
    QUEST_REWARD,     // Quest completion reward
    PURCHASE,         // Coin purchase
    DAILY_BONUS,      // Daily login bonus
    PENALTY           // Penalty deduction
}
```

**Process Flow:**

1. Queries: `transactionRepository.findByFromUserOrToUser(user, user)`
2. Sorts by creation date descending
3. Returns transaction list

---

### 🔹 Send Tip

**Endpoint:** `POST /api/wallet/tip`
**Auth:** Required

**Request Body:**

```json
{
  "recipient_id": "507f1f77bcf86cd799439011",
  "amount": 50.0,
  "message": "Thanks for your help!"
}
```

**Process Flow:**

1. Validates amount > 0 and recipient exists
2. `CurrencyService.sendTip()` calls `transferCoins()`
3. Creates transaction with type TIP
4. Returns transaction record

---

### 🔹 Claim Daily Bonus

**Endpoint:** `POST /api/wallet/claim-daily-bonus`
**Auth:** Required

**Process Flow:**

1. `CurrencyService.awardDailyBonus()` checks:
   - Last daily bonus timestamp
   - Must be 24+ hours ago
2. Credits coins (e.g., 50 coins)
3. Updates user's last bonus claim timestamp
4. Creates transaction with type DAILY_BONUS

---

### 🔹 Add Coins

**Endpoint:** `POST /api/wallet/add-coins`
**Auth:** Required

**Request Body:**

```json
{
  "amount": 500.0,
  "payment_method": "credit_card"
}
```

**Process Flow:**

1. In production, would verify payment with payment gateway
2. `CurrencyService.creditCoins()` adds coins
3. Creates transaction with type PURCHASE
4. Returns transaction

---

### 🔹 Reset Balance to Minimum

**Endpoint:** `POST /api/wallet/reset-to-minimum`
**Auth:** Required

**Process Flow:**

1. Checks if user balance < 1000
2. If yes, credits difference to reach 1000
3. For testing/demo purposes

---

## 7️⃣ Quest Endpoints

### 🔹 Get Quests

**Endpoint:** `GET /api/quests`
**Auth:** Public

**Query Parameters:**

- `status` (optional) - Filter by status
- `page` (default: 1)
- `pageSize` (default: 20)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "First Report",
      "description": "Report your first lost or found item",
      "type": "REPORT_ITEM",
      "requirement": 1,
      "rewardCoins": 100.0,
      "rewardBadge": "Reporter",
      "isActive": true,
      "userProgress": {
        "started": true,
        "progress": 1,
        "completed": true
      }
    }
  ]
}
```

**Quest Types:**

```java
enum QuestType {
    REPORT_ITEM,       // Report X items
    RETURN_ITEM,       // Return X items
    CLAIM_ITEM,        // Make X claims
    EARN_COINS,        // Earn X coins
    HELP_USERS         // Help X users
}
```

**Process Flow:**

1. `QuestService.getQuests()` queries active quests
2. For authenticated users:
   - Loads user quest progress from `user_quests` collection
   - Joins quest data with user progress
3. Returns enriched quest data

---

### 🔹 Start Quest

**Endpoint:** `POST /api/quests/{id}/start`
**Auth:** Required

**Process Flow:**

1. Creates `UserQuest` record:
   - Links user and quest
   - Sets status to IN_PROGRESS
   - Initializes progress to 0
2. Saves to MongoDB

---

### 🔹 Complete Quest

**Endpoint:** `POST /api/quests/{id}/complete`
**Auth:** Required

**Process Flow:**

1. `QuestService.completeQuest()` validates:
   - Quest exists
   - User has quest in progress
   - Progress meets requirement
2. Awards rewards:
   - Credits coins via `CurrencyService`
   - Adds badge to user if applicable
3. Updates user quest status to COMPLETED
4. Increments user's `questsCompletedCount`

---

## 8️⃣ Leaderboard Endpoints

### 🔹 Get Leaderboard

**Endpoint:** `GET /api/leaderboard`
**Auth:** Public

**Query Parameters:**

- `page` (default: 1)
- `pageSize` (default: 20)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "user": {
        "id": "...",
        "displayName": "John Doe",
        "avatarUrl": "..."
      },
      "score": 1500,
      "itemsReturned": 15,
      "badges": ["Helper", "Super Finder"]
    }
  ]
}
```

**Process Flow:**

1. `LeaderboardService.getLeaderboard()` queries:
   - Sorts users by score descending
   - Then by itemsReturnedCount descending
   - Applies pagination
2. Calculates rank based on position
3. Converts to `LeaderboardEntryResponse` DTOs

**Ranking Logic:**

```java
Query query = new Query()
    .with(Sort.by(Sort.Direction.DESC, "score")
        .and(Sort.by(Sort.Direction.DESC, "itemsReturnedCount")));
```

---

### 🔹 Get Current User Rank

**Endpoint:** `GET /api/leaderboard/me`
**Auth:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "rank": 42,
    "user": {...},
    "score": 450
  }
}
```

**Process Flow:**

1. Gets current user
2. Counts users with higher scores
3. Calculates rank = count + 1

---

## 9️⃣ Webhook Endpoints

### 🔹 Clerk User Webhook

**Endpoint:** `POST /api/webhooks/clerk/user`
**Auth:** Public (Clerk signature verification)

**Purpose:** Sync Clerk user events with local database

**Events Handled:**

- `user.created` - Create user in MongoDB
- `user.updated` - Update user data
- `user.deleted` - Soft delete user

**Process Flow:**

1. Receives webhook from Clerk
2. Verifies Clerk signature
3. Processes event based on type
4. Updates MongoDB accordingly

---

## 🔄 Service Layer Deep Dive

### RewardCalculationService

**File:** `RewardCalculationService.java`

**Key Method:** `calculateReward(LostReport lostReport)`

**Category Base Rewards Map:**

```java
Electronics: 100.0
Jewelry: 150.0
Documents: 80.0
Wallet: 120.0
Keys: 50.0
Phone: 100.0
Laptop: 150.0
Bag: 70.0
Clothing: 40.0
Pet: 200.0
Vehicle: 300.0
Other: 50.0
```

**Current Logic:**

- Uses owner's set `rewardAmount` from lost report
- If not set, uses minimum default of 50.0 coins

**Legacy Dynamic Calculation (not currently used):**

- Base reward by category
- Time factor (items lost longer get higher rewards)
- Urgency factor (more details = higher reward)
- Location factor (placeholder for future)

---

### CurrencyService

**File:** `CurrencyService.java`

**Core Methods:**

1. **creditCoins(user, amount, type, description, metadata)**

   - Adds coins to user wallet
   - Updates `lifetimeEarnings`
   - Creates transaction record

2. **debitCoins(user, amount, type, description, metadata)**

   - Deducts coins from user wallet
   - Validates sufficient balance
   - Updates `lifetimeSpent`
   - Creates transaction record

3. **transferCoins(fromUser, toUser, amount, type, description)**
   - Transfers coins between users
   - Validates sender has sufficient balance
   - Prevents self-transfer
   - Updates both users' balances
   - Creates transaction record

**Error Handling:**

```java
if (user.getCoins() < amount) {
    throw new RuntimeException("Insufficient coins. You have " +
        user.getCoins() + " coins but need " + amount);
}
```

---

### ClaimService

**File:** `ClaimService.java`

**Key Validations:**

1. **createClaim:**

   - Lost report must be OPEN
   - Claimer cannot be owner
   - Found report must belong to claimer

2. **approveClaim:**

   - Only owner can approve
   - Claim must be PENDING

3. **completeClaimAndReleaseReward:**
   - Claim must be APPROVED
   - Reward not already paid
   - Owner has sufficient coins

**Transaction Management:**
Uses `@Transactional` to ensure data consistency across multiple updates.

---

### UserService

**File:** `UserService.java`

**Key Methods:**

1. **getCurrentUser()**

   ```java
   String email = SecurityContextHolder.getContext()
       .getAuthentication().getName();
   return userRepository.findByEmail(email)
       .orElseThrow(() -> new RuntimeException("User not found"));
   ```

2. **updateCurrentUser(displayName, avatarUrl, bio, phone)**

   - Updates user profile fields
   - Saves to MongoDB

3. **syncOrCreateUserFromClerk(clerkId, email, displayName, avatarUrl)**
   - Called by webhook or auth filter
   - Creates user if doesn't exist
   - Syncs Clerk data with local database

---

## 📊 Data Models Deep Dive

### User Model

**Collection:** `users`

**Key Fields:**

```java
String id;                      // MongoDB _id
String clerkId;                 // Clerk authentication ID (unique)
String email;                   // Email (unique)
String displayName;             // Display name
String avatarUrl;              // Profile picture URL
Role role;                     // USER or ADMIN
Integer score;                 // Leaderboard score
Double coins;                  // Current coin balance (starts at 1000)
Double lifetimeEarnings;       // Total coins earned
Double lifetimeSpent;          // Total coins spent
List<String> badges;           // Achievement badges
Integer foundReportsCount;     // Count of found reports
Integer lostReportsCount;      // Count of lost reports
Integer itemsReturnedCount;    // Count of successfully returned items
Integer questsCompletedCount;  // Count of completed quests
```

**Indexes:**

- `clerkId` - Unique
- `email` - Unique

---

### LostReport Model

**Collection:** `lost_reports`

**Key Fields:**

```java
String id;
String title;
String description;
String category;               // Phone, Wallet, Keys, etc.
List<String> images;          // Image URLs
List<String> tags;            // Search tags
String color;
String brand;
Double rewardAmount;          // Reward for finding
Double latitude;              // Location coordinates
Double longitude;
String locationName;
ItemStatus status;            // OPEN, MATCHED, CLOSED
OffsetDateTime lostAt;        // When item was lost
User reportedBy;              // @DBRef to User
Visibility visibility;        // PUBLIC, PRIVATE
String matchedFoundItemId;    // Linked found report ID
String approvedClaimId;       // Approved claim ID
Boolean rewardReleased;       // Reward payment status
```

**Indexes:** Typically on `reportedBy`, `status`, `category` for efficient queries

---

### FoundReport Model

**Collection:** `found_reports`

**Key Fields:**

```java
String id;
String title;
String description;
String category;
List<String> images;
List<String> tags;
String color;
String brand;
Double latitude;
Double longitude;
String locationName;
ItemStatus status;            // OPEN, MATCHED, CLOSED
OffsetDateTime foundAt;       // When item was found
User reportedBy;             // @DBRef to User
Condition foundCondition;    // NEW, GOOD, WORN, DAMAGED
String holdingInstructions;  // How to contact/retrieve
String matchedLostItemId;    // Linked lost report ID
```

---

### Claim Model

**Collection:** `claims`

**Key Fields:**

```java
String id;
LostReport lostReport;        // @DBRef
FoundReport foundReport;      // @DBRef (optional)
User claimer;                 // @DBRef (finder)
User owner;                   // @DBRef (lost item owner)
ClaimStatus status;           // PENDING, APPROVED, REJECTED, COMPLETED
String claimerMessage;        // Message from finder
String ownerResponse;         // Response from owner
Double rewardAmount;          // Reward amount
Boolean rewardPaid;           // Payment status
OffsetDateTime approvedAt;
OffsetDateTime rejectedAt;
```

---

### Transaction Model

**Collection:** `transactions`

**Key Fields:**

```java
String id;
User fromUser;                // @DBRef (sender, null if system)
User toUser;                  // @DBRef (recipient, null if system)
Double amount;
TransactionType type;         // REWARD_PAYMENT, TIP, etc.
TransactionStatus status;     // PENDING, COMPLETED, FAILED
String description;
String metadata;              // JSON metadata
```

---

## 🔧 Utility Services & Components

### JwtTokenProvider

**File:** `JwtTokenProvider.java`

**Methods:**

- `generateToken(UserDetails userDetails)` - Creates JWT token
- `extractUsername(String token)` - Extracts email from token
- `validateToken(String token, UserDetails userDetails)` - Validates token
- `isTokenExpired(String token)` - Checks expiration

**Token Structure:**

```
Header.Payload.Signature
```

**Claims Include:**

- Subject: user email
- IssuedAt: token creation time
- Expiration: 24 hours from creation

---

### ClerkTokenVerifier

**File:** `ClerkTokenVerifier.java`

**Purpose:** Verify JWT tokens issued by Clerk

**Process:**

1. Fetch Clerk's public keys (JWKS)
2. Verify token signature
3. Validate claims (issuer, audience, expiration)
4. Extract user information

---

### GlobalExceptionHandler

**File:** `GlobalExceptionHandler.java`

**Purpose:** Centralized exception handling

**Handles:**

- `RuntimeException` → 400 Bad Request
- `MethodArgumentNotValidException` → 400 Validation Error
- Generic exceptions → 500 Internal Server Error

**Response Format:**

```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🚀 Application Startup

### LostCityApplication.java

```java
@SpringBootApplication
public class LostCityApplication {
    public static void main(String[] args) {
        SpringApplication.run(LostCityApplication.class, args);
    }
}
```

**Startup Process:**

1. Spring Boot initializes application context
2. Auto-configures MongoDB connection
3. Scans for `@Component`, `@Service`, `@Repository`, `@Controller` annotations
4. Initializes security filter chain
5. Registers REST endpoints
6. Starts embedded Tomcat server on port 8080
7. Application ready to receive requests

---

## 📝 Key Architectural Patterns

### 1. Layered Architecture

```
Controller → Service → Repository → MongoDB
```

### 2. DTO Pattern

- Request DTOs for incoming data
- Response DTOs for outgoing data
- Separates internal models from API contract

### 3. Repository Pattern

- Abstracts database operations
- Uses Spring Data MongoDB

### 4. Dependency Injection

- `@RequiredArgsConstructor` with Lombok
- Constructor injection for dependencies

### 5. Transaction Management

- `@Transactional` for multi-step operations
- Ensures data consistency

---

## 🔍 Common Variables & Annotations

### Spring Annotations

**@RestController** - Marks class as REST API controller
**@RequestMapping** - Maps URL path to controller
**@PostMapping** - Maps HTTP POST requests
**@GetMapping** - Maps HTTP GET requests
**@PathVariable** - Extracts URL path variable
**@RequestParam** - Extracts query parameter
**@RequestBody** - Binds request body to object
**@Valid** - Triggers validation
**@Service** - Marks class as service component
**@Repository** - Marks class as repository
**@Configuration** - Marks class as configuration
**@Bean** - Defines Spring bean
**@Transactional** - Wraps method in transaction

### MongoDB Annotations

**@Document** - Marks class as MongoDB document
**@Id** - Marks field as document ID
**@DBRef** - Creates reference to another document
**@Indexed** - Creates database index
**@CreatedDate** - Auto-populates creation date
**@LastModifiedDate** - Auto-updates modification date

### Lombok Annotations

**@Getter** - Generates getter methods
**@Setter** - Generates setter methods
**@Builder** - Generates builder pattern
**@NoArgsConstructor** - Generates no-arg constructor
**@AllArgsConstructor** - Generates all-args constructor
**@RequiredArgsConstructor** - Generates constructor for final fields
**@Slf4j** - Generates logger field

---

## 🧪 Testing Endpoints

### Using cURL:

**Register:**

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","displayName":"Test User"}'
```

**Login:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Current User (with token):**

```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📈 Performance Considerations

1. **Database Indexing:**

   - Indexes on frequently queried fields
   - Unique indexes on `email`, `clerkId`

2. **Pagination:**

   - All list endpoints use pagination
   - Prevents large data transfers

3. **Lazy Loading:**

   - `@DBRef` fields loaded on demand
   - Reduces initial query overhead

4. **Connection Pooling:**
   - MongoDB connection pooling automatic
   - Reuses connections for efficiency

---

## 🔒 Security Best Practices

1. **Password Hashing:** BCrypt with strength 10
2. **JWT Tokens:** Signed with HS256 algorithm
3. **CORS Configuration:** Restricts allowed origins
4. **Input Validation:** `@Valid` annotation + Jakarta Validation
5. **SQL Injection Prevention:** MongoDB query builders (not raw queries)
6. **Authentication Filter:** Validates every protected request
7. **Role-Based Access:** Admin vs User roles (expandable)

---

## 🐛 Common Issues & Debugging

### Issue: "User not found"

**Cause:** JWT token invalid or expired
**Solution:** Re-authenticate to get new token

### Issue: "Insufficient coins"

**Cause:** User balance too low
**Solution:** Add coins via `/api/wallet/add-coins` or reset balance

### Issue: MongoDB connection error

**Cause:** Invalid connection string or network issue
**Solution:** Check `application.yml` and network connectivity

### Issue: CORS error in browser

**Cause:** Frontend origin not in `allowed-origins`
**Solution:** Add origin to `cors.allowed-origins` in `application.yml`

---

## 📚 Additional Resources

- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **API Docs:** `http://localhost:8080/api-docs`
- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **MongoDB Docs:** https://www.mongodb.com/docs/
- **JWT Docs:** https://jwt.io/

---

## 🎯 Summary

This LostCity backend provides a complete lost and found platform with:

- User authentication (JWT + Clerk)
- Lost/found item reporting
- Claim management system
- Virtual currency & rewards
- Quest system
- Leaderboard
- Comment system
- Transaction history

The architecture follows best practices with clear separation of concerns, proper error handling, and comprehensive API documentation.
