# Backend Requirements for Lost & Found Quest

## Overview

This document outlines the complete backend requirements for the Lost & Found Quest application, integrating **Spring Boot**, **MongoDB**, **Clerk Authentication**, and **Stripe Payments**.

---

## 1. Technology Stack

### Core Backend

- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: MongoDB (NoSQL)
- **Authentication**: Clerk (JWT-based)
- **Payment Gateway**: Stripe
- **API Style**: RESTful API
- **Documentation**: Swagger/OpenAPI

### Additional Dependencies

- Spring Data MongoDB
- Spring Security (with Clerk integration)
- Spring Boot Validation
- Lombok
- ModelMapper/MapStruct
- Stripe Java SDK
- WebSocket support for real-time chat

---

## 2. Database Schema (MongoDB Collections)

### 2.1 Users Collection

```json
{
  "_id": "ObjectId",
  "clerkUserId": "string (unique, from Clerk)",
  "username": "string (unique)",
  "email": "string (unique)",
  "displayName": "string",
  "avatar": "string (URL)",
  "bio": "string",
  "level": "number (default: 1)",
  "currentXP": "number (default: 0)",
  "totalCoins": "number (default: 0)",
  "stripeCustomerId": "string",
  "stats": {
    "itemsFound": "number",
    "itemsReturned": "number",
    "itemsLost": "number",
    "totalRewardsEarned": "number",
    "totalRewardsPaid": "number",
    "helpfulnessScore": "number (0-100)",
    "responseRate": "number (0-100)",
    "averageResponseTime": "number (minutes)",
    "successRate": "number (0-100)"
  },
  "badges": ["badgeId1", "badgeId2"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "isActive": "boolean",
  "isVerified": "boolean"
}
```

### 2.2 LostItems Collection

```json
{
  "_id": "ObjectId",
  "userId": "string (ref: Users)",
  "title": "string (required)",
  "description": "string (required)",
  "category": "string (enum: Electronics, Accessories, Jewelry, Documents, Keys, Bags, Clothing, Other)",
  "location": {
    "address": "string",
    "coordinates": {
      "latitude": "number",
      "longitude": "number"
    },
    "placeName": "string"
  },
  "dateLost": "timestamp",
  "images": ["string (URLs)"],
  "rewardAmount": "number (in coins)",
  "rewardType": "string (enum: Coins, Cash, Both)",
  "cashRewardAmount": "number (optional, in cents)",
  "distinguishingFeatures": ["string"],
  "contactInfo": "string (email/phone)",
  "status": "string (enum: Active, Claimed, Expired, Cancelled)",
  "verificationQuestions": [
    {
      "question": "string",
      "answer": "string (encrypted)"
    }
  ],
  "claimedBy": "string (ref: Users, optional)",
  "claimedAt": "timestamp (optional)",
  "expiresAt": "timestamp",
  "views": "number (default: 0)",
  "responses": "number (default: 0)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 2.3 FoundItems Collection

```json
{
  "_id": "ObjectId",
  "finderId": "string (ref: Users)",
  "title": "string (required)",
  "description": "string (required)",
  "category": "string (enum)",
  "location": {
    "address": "string",
    "coordinates": {
      "latitude": "number",
      "longitude": "number"
    },
    "placeName": "string"
  },
  "dateFound": "timestamp",
  "timeFound": "string",
  "images": ["string (URLs)"],
  "distinguishingFeatures": ["string"],
  "status": "string (enum: Available, Claimed, Matched, Returned)",
  "matchedLostItemId": "string (ref: LostItems, optional)",
  "claimedBy": "string (ref: Users, optional)",
  "returnedAt": "timestamp (optional)",
  "views": "number",
  "responses": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 2.4 Matches Collection

```json
{
  "_id": "ObjectId",
  "lostItemId": "string (ref: LostItems)",
  "foundItemId": "string (ref: FoundItems)",
  "ownerId": "string (ref: Users)",
  "finderId": "string (ref: Users)",
  "status": "string (enum: Pending, VerificationInProgress, Verified, Completed, Disputed, Cancelled)",
  "verificationStatus": {
    "questionsAnswered": "boolean",
    "answersCorrect": "boolean",
    "photoVerified": "boolean",
    "meetingScheduled": "boolean"
  },
  "meetingDetails": {
    "location": "string",
    "scheduledTime": "timestamp",
    "meetingStatus": "string (enum: Scheduled, Completed, NoShow, Cancelled)"
  },
  "rewardDetails": {
    "coinAmount": "number",
    "cashAmount": "number (cents)",
    "stripePaymentIntentId": "string",
    "paymentStatus": "string (enum: Pending, Processing, Completed, Failed, Refunded)"
  },
  "completedAt": "timestamp (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 2.5 Messages Collection (Chat)

```json
{
  "_id": "ObjectId",
  "matchId": "string (ref: Matches)",
  "senderId": "string (ref: Users)",
  "receiverId": "string (ref: Users)",
  "message": "string",
  "messageType": "string (enum: Text, Image, Location, SystemNotification)",
  "isRead": "boolean (default: false)",
  "readAt": "timestamp (optional)",
  "createdAt": "timestamp"
}
```

### 2.6 Transactions Collection

```json
{
  "_id": "ObjectId",
  "userId": "string (ref: Users)",
  "transactionType": "string (enum: RewardEarned, RewardPaid, PostingFee, Purchase, Withdrawal)",
  "amount": "number (coins or cents)",
  "currency": "string (Coins or USD)",
  "description": "string",
  "relatedItemId": "string (ref: LostItems/FoundItems, optional)",
  "relatedMatchId": "string (ref: Matches, optional)",
  "stripeTransactionId": "string (optional)",
  "status": "string (enum: Pending, Completed, Failed, Refunded)",
  "createdAt": "timestamp"
}
```

### 2.7 Badges Collection

```json
{
  "_id": "ObjectId",
  "name": "string (unique)",
  "description": "string",
  "icon": "string (emoji or icon code)",
  "rarity": "string (enum: Common, Rare, Epic, Legendary)",
  "criteria": {
    "type": "string (enum: ItemsFound, ItemsReturned, RewardsEarned, Level, SuccessRate, etc.)",
    "threshold": "number",
    "condition": "string (>=, ==, etc.)"
  },
  "xpReward": "number",
  "coinReward": "number",
  "isActive": "boolean",
  "createdAt": "timestamp"
}
```

### 2.8 Notifications Collection

```json
{
  "_id": "ObjectId",
  "userId": "string (ref: Users)",
  "type": "string (enum: NewMatch, MessageReceived, PaymentReceived, BadgeEarned, LevelUp, ItemClaimed, etc.)",
  "title": "string",
  "message": "string",
  "relatedEntityId": "string (optional)",
  "relatedEntityType": "string (optional)",
  "isRead": "boolean (default: false)",
  "readAt": "timestamp (optional)",
  "createdAt": "timestamp"
}
```

### 2.9 Reports Collection (For disputes/abuse)

```json
{
  "_id": "ObjectId",
  "reporterId": "string (ref: Users)",
  "reportedUserId": "string (ref: Users)",
  "reportedItemId": "string (ref: LostItems/FoundItems, optional)",
  "reportType": "string (enum: Fraud, Spam, Abuse, Scam, Other)",
  "description": "string",
  "evidence": ["string (URLs)"],
  "status": "string (enum: Pending, UnderReview, Resolved, Dismissed)",
  "adminNotes": "string (optional)",
  "resolvedAt": "timestamp (optional)",
  "createdAt": "timestamp"
}
```

---

## 3. API Endpoints

### 3.1 Authentication (Clerk Integration)

- `POST /api/auth/webhook` - Clerk webhook for user sync
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### 3.2 Users

- `GET /api/users/{userId}` - Get user profile
- `GET /api/users/{userId}/stats` - Get user statistics
- `GET /api/users/{userId}/badges` - Get user badges
- `PUT /api/users/me` - Update own profile
- `POST /api/users/me/avatar` - Upload avatar

### 3.3 Lost Items

- `POST /api/lost-items` - Create lost item report
- `GET /api/lost-items` - List all lost items (with pagination, filters)
- `GET /api/lost-items/{id}` - Get lost item details
- `PUT /api/lost-items/{id}` - Update lost item
- `DELETE /api/lost-items/{id}` - Delete/Cancel lost item
- `GET /api/lost-items/my` - Get user's lost items
- `POST /api/lost-items/{id}/view` - Increment view count

### 3.4 Found Items

- `POST /api/found-items` - Report found item
- `GET /api/found-items` - List all found items (with pagination, filters)
- `GET /api/found-items/{id}` - Get found item details
- `PUT /api/found-items/{id}` - Update found item
- `DELETE /api/found-items/{id}` - Delete found item
- `GET /api/found-items/my` - Get user's found items
- `POST /api/found-items/{id}/view` - Increment view count

### 3.5 Matches

- `POST /api/matches` - Create a match (claim an item)
- `GET /api/matches` - List user's matches
- `GET /api/matches/{id}` - Get match details
- `PUT /api/matches/{id}/verify` - Submit verification
- `PUT /api/matches/{id}/schedule-meeting` - Schedule meeting
- `PUT /api/matches/{id}/complete` - Mark as completed
- `PUT /api/matches/{id}/dispute` - Report dispute
- `DELETE /api/matches/{id}` - Cancel match

### 3.6 Messages (Chat)

- `POST /api/messages` - Send message
- `GET /api/messages/match/{matchId}` - Get messages for a match
- `GET /api/messages/conversations` - Get all conversations
- `PUT /api/messages/{id}/read` - Mark message as read
- `WS /ws/chat` - WebSocket for real-time chat

### 3.7 Payments (Stripe)

- `POST /api/payments/create-intent` - Create payment intent for reward
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/withdraw` - Withdraw earnings
- `POST /api/payments/add-payment-method` - Add payment method
- `GET /api/payments/payment-methods` - List payment methods

### 3.8 Transactions

- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/{id}` - Get transaction details

### 3.9 Badges

- `GET /api/badges` - Get all badges
- `GET /api/badges/user/{userId}` - Get user's badges
- `POST /api/badges/check` - Check and award badges (internal)

### 3.10 Leaderboard

- `GET /api/leaderboard` - Get leaderboard (with filters: weekly, monthly, all-time)
- `GET /api/leaderboard/me` - Get current user's rank

### 3.11 Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/{id}` - Delete notification

### 3.12 Reports

- `POST /api/reports` - Submit a report
- `GET /api/reports/my` - Get user's reports
- `GET /api/reports/{id}` - Get report details

### 3.13 Search

- `GET /api/search/lost-items` - Search lost items
- `GET /api/search/found-items` - Search found items
- `GET /api/search/users` - Search users

### 3.14 Admin (Optional)

- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}/status` - Update user status
- `GET /api/admin/reports` - List all reports
- `PUT /api/admin/reports/{id}/resolve` - Resolve report
- `GET /api/admin/analytics` - Get platform analytics

---

## 4. Business Logic Requirements

### 4.1 User Management

- Sync users from Clerk webhook on sign-up
- Calculate and update user levels based on XP
- Calculate statistics (response rate, success rate, etc.)
- Award badges when criteria are met

### 4.2 Matching Algorithm

- Suggest potential matches between lost and found items based on:
  - Category similarity
  - Location proximity (within radius)
  - Date proximity
  - Description similarity (NLP/keyword matching)
  - Image similarity (optional: ML-based)

### 4.3 Verification Process

1. User claims an item
2. Owner receives verification questions
3. Claimer must answer questions correctly
4. Photo comparison (optional: manual or AI-assisted)
5. Meeting scheduled
6. Both parties confirm handover
7. Payment processed

### 4.4 Payment Flow (Stripe)

1. Owner sets reward amount
2. When posting, owner pays posting fee (50 coins)
3. When match is verified, owner initiates payment
4. Stripe payment intent created
5. Owner pays via Stripe
6. Finder receives reward after successful handover
7. Platform takes small commission (optional)

### 4.5 Reward System

- XP earned for:
  - Finding items: 100 XP
  - Returning items: 200 XP
  - Quick responses: 50 XP
  - High ratings: 25 XP
- Coins earned from:
  - Rewards
  - Daily quests
  - Achievements
- Level calculation: `Level = floor(sqrt(totalXP / 100))`

### 4.6 Badge System

- Auto-check badge criteria after each action
- Award badges and send notifications
- Grant XP and coin bonuses for badges

### 4.7 Security & Validation

- Encrypt verification answers
- Rate limiting on API endpoints
- Image upload validation (size, format)
- Location validation
- Payment fraud detection
- User verification (phone/email)

---

## 5. Additional Features

### 5.1 Image Upload

- **Service**: AWS S3 / Cloudinary / Firebase Storage
- **Validation**: Max 10MB, formats: JPG, PNG, WEBP
- **Processing**: Auto-resize, compress, generate thumbnails

### 5.2 Real-time Features

- WebSocket for chat
- Server-Sent Events (SSE) for notifications
- Real-time leaderboard updates

### 5.3 Email/SMS Notifications

- **Service**: SendGrid / Twilio
- Notifications for:
  - New matches
  - Messages received
  - Payment received
  - Meeting reminders
  - Badge earned

### 5.4 Geolocation

- Calculate distance between locations
- Location-based search with radius filter
- Map integration support (return coordinates)

### 5.5 Analytics

- Track user activity
- Item recovery rate
- Platform usage statistics
- Revenue analytics

---

## 6. Security Requirements

### 6.1 Authentication

- Clerk JWT validation on all protected endpoints
- Role-based access control (User, Admin)
- API key for internal services

### 6.2 Data Protection

- Encrypt sensitive data (verification answers, payment info)
- HTTPS only
- CORS configuration
- Input sanitization
- SQL/NoSQL injection prevention

### 6.3 Payment Security

- PCI compliance via Stripe
- No storage of card details
- Webhook signature verification
- Idempotency keys for payments

---

## 7. Performance Requirements

- Response time: < 200ms for API calls
- Support 1000+ concurrent users
- Database indexing on:
  - User email, clerkUserId
  - Item status, category, location
  - Match status
- Caching: Redis for frequently accessed data
- CDN for static assets and images

---

## 8. Monitoring & Logging

- Application logs (Spring Boot Logging)
- Error tracking (Sentry / New Relic)
- Performance monitoring (APM)
- Database query monitoring
- Webhook failure tracking
- Payment transaction logs

---

## 9. Testing Requirements

- Unit tests for business logic
- Integration tests for API endpoints
- Stripe webhook testing
- Load testing
- Security testing

---

## 10. Deployment

- **Environment**: Production, Staging, Development
- **Hosting**: AWS / Google Cloud / Azure / Heroku
- **CI/CD**: GitHub Actions / Jenkins
- **Database**: MongoDB Atlas (cloud)
- **Containerization**: Docker (optional)

---

## 11. Environment Variables

```properties
# MongoDB
MONGODB_URI=mongodb+srv://...
MONGODB_DATABASE=lostcity

# Clerk
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_...

# Storage
AWS_S3_BUCKET=...
AWS_ACCESS_KEY=...
AWS_SECRET_KEY=...

# Email
SENDGRID_API_KEY=...

# App
SERVER_PORT=8080
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
JWT_SECRET=...

# Redis (optional)
REDIS_URL=redis://...
```

---

## 12. API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-12-15T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "timestamp": "2025-12-15T10:30:00Z"
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  },
  "timestamp": "2025-12-15T10:30:00Z"
}
```

---

## 13. Development Phases

### Phase 1: Core Backend (Week 1-2)

- User authentication with Clerk
- MongoDB setup
- User CRUD operations
- Lost/Found items CRUD

### Phase 2: Matching & Verification (Week 3)

- Match creation
- Verification flow
- Messages/Chat system

### Phase 3: Payments (Week 4)

- Stripe integration
- Payment flow
- Transaction management

### Phase 4: Gamification (Week 5)

- Badge system
- XP and leveling
- Leaderboard
- Daily quests (optional)

### Phase 5: Enhancement (Week 6+)

- Search and filtering
- Notifications
- Analytics
- Admin panel
- Image upload
- Optimization

---

## Summary

This backend will provide a complete, secure, and scalable API for the Lost & Found Quest application. The Spring Boot backend with MongoDB will handle all business logic, while Clerk manages authentication and Stripe handles payments. The gamification features (badges, levels, leaderboard) will encourage user engagement and promote humanitarian behavior.
