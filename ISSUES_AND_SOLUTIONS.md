# LostCity Project - Issues Faced & Solutions Applied

## Development Timeline & Problem-Solving Documentation

---

## Issue #1: Backend Server Startup and Management

### Problem

- Backend server needed to be started manually each time
- No easy way to restart server after code changes
- PID management for stopping existing processes was manual

### Approaches Tried

1. **Manual Java commands** - Too verbose and error-prone
2. **Simple shell script** - Lacked proper error handling and status checks
3. **Advanced restart script** - Final solution

### Best Fix Applied

Created `restart-backend.sh` with:

- Automatic PID-based process termination
- Maven build and background execution
- Startup health checks with 15-second wait time
- Log file management
- User-friendly status messages

**File:** `restart-backend.sh`

```bash
#!/bin/bash
# Stops existing process, builds, and starts backend
# Includes health check and PID tracking
```

**Commands:**

```bash
chmod +x restart-backend.sh
./restart-backend.sh
```

**Result:** ✅ Successfully implemented automated backend restart with proper process management

---

## Issue #2: Authentication System Integration

### Problem

- Needed dual authentication support (JWT + Clerk)
- Security filter chain causing conflicts
- User synchronization between Clerk and MongoDB

### Approaches Tried

1. **JWT-only authentication** - Worked but wanted external auth provider
2. **Clerk-only authentication** - Needed local user data storage
3. **Hybrid approach** - Final solution

### Best Fix Applied

Implemented dual authentication system:

**Components:**

- `JwtTokenProvider.java` - JWT token generation and validation
- `ClerkTokenVerifier.java` - Clerk token verification
- `JwtAuthenticationFilter.java` - Unified filter for both auth types
- `WebhookController.java` - Clerk user sync webhooks

**Security Flow:**

```
Request → Extract Token → Verify (JWT/Clerk) → Load User → Set Auth Context
```

**Configuration:**

```yaml
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000 # 24 hours

clerk:
  publishable-key: ${CLERK_PUBLISHABLE_KEY}
```

**Result:** ✅ Seamless authentication with both local JWT and Clerk support

---

## Issue #3: MongoDB Connection and Date Handling

### Problem

- OffsetDateTime not natively supported by MongoDB
- Date conversion issues causing serialization errors
- Audit timestamps not populating automatically

### Approaches Tried

1. **LocalDateTime** - Lost timezone information
2. **Date objects** - Incompatible with modern Java date/time API
3. **Custom converters** - Final solution

### Best Fix Applied

Created custom MongoDB converters in `MongoConfig.java`:

**Converters:**

```java
// Read: MongoDB Date → Java OffsetDateTime
class OffsetDateTimeReadConverter implements Converter<Date, OffsetDateTime> {
    public OffsetDateTime convert(Date source) {
        return source.toInstant().atOffset(ZoneOffset.UTC);
    }
}

// Write: Java OffsetDateTime → MongoDB Date
class OffsetDateTimeWriteConverter implements Converter<OffsetDateTime, Date> {
    public Date convert(OffsetDateTime source) {
        return Date.from(source.toInstant());
    }
}
```

**Configuration:**

```java
@Configuration
@EnableMongoAuditing(dateTimeProviderRef = "offsetDateTimeProvider")
public class MongoConfig {
    @Bean
    public DateTimeProvider offsetDateTimeProvider() {
        return () -> Optional.of(OffsetDateTime.now(ZoneOffset.UTC));
    }
}
```

**Result:** ✅ Proper date/time handling with automatic audit timestamps

---

## Issue #4: Reward Calculation System

### Problem

- Static rewards were not fair for all item types
- No consideration for item value or urgency
- Owners wanted control over reward amounts

### Approaches Tried

1. **Fixed rewards per category** - Too rigid
2. **Fully dynamic calculation** - Too complex, owners had no control
3. **Owner-set with dynamic suggestions** - Final solution

### Best Fix Applied

Created `RewardCalculationService.java` with hybrid approach:

**Implementation:**

```java
public Double calculateReward(LostReport lostReport) {
    // Use owner's set reward amount
    Double ownerReward = lostReport.getRewardAmount();

    // Default minimum if not set
    Double finalReward = (ownerReward != null && ownerReward > 0)
            ? ownerReward
            : 50.0;

    return finalReward;
}
```

**Category Base Suggestions:**

- Electronics: 100 coins
- Jewelry: 150 coins
- Pet: 200 coins
- Vehicle: 300 coins
- Other: 50 coins minimum

**Features:**

- Owners set their own reward
- System provides suggestions based on category
- Minimum default of 50 coins
- Reward breakdown endpoint for transparency

**Result:** ✅ Flexible reward system giving control to item owners

---

## Issue #5: Claim Workflow and Status Management

### Problem

- Complex state machine for claim approval process
- Need to track multiple statuses across different entities
- Reward payment needed to be atomic with claim completion

### Approaches Tried

1. **Simple boolean flags** - Couldn't track intermediate states
2. **String status fields** - Type-unsafe and error-prone
3. **Enum-based state machine** - Final solution

### Best Fix Applied

Implemented proper claim workflow in `ClaimService.java`:

**Claim Status Enum:**

```java
enum ClaimStatus {
    PENDING,    // Submitted, awaiting owner review
    APPROVED,   // Owner confirmed match
    REJECTED,   // Owner rejected claim
    COMPLETED   // Reward paid, item returned
}
```

**Workflow Steps:**

1. **Create Claim** → Status: PENDING
2. **Owner Reviews** → Approve (APPROVED) or Reject (REJECTED)
3. **Complete** → Transfer coins, Status: COMPLETED

**Transaction Management:**

```java
@Transactional
public Claim completeClaimAndReleaseReward(String claimId) {
    // Validate claim is APPROVED
    // Check owner has sufficient coins
    // Transfer coins atomically
    // Update claim status to COMPLETED
    // Update report statuses
    // Increment user stats
}
```

**Result:** ✅ Robust claim workflow with proper state transitions and atomic operations

---

## Issue #6: Currency System and Transaction Tracking

### Problem

- Needed virtual currency for rewards
- Required transaction history for auditing
- Prevent negative balances
- Track lifetime earnings/spending

### Approaches Tried

1. **Simple balance field** - No transaction history
2. **Transaction log without validation** - Could go negative
3. **Full currency service with validation** - Final solution

### Best Fix Applied

Created comprehensive `CurrencyService.java`:

**Core Operations:**

```java
// Credit coins (add)
public Transaction creditCoins(User user, Double amount,
    TransactionType type, String description, String metadata)

// Debit coins (subtract)
public Transaction debitCoins(User user, Double amount,
    TransactionType type, String description, String metadata)

// Transfer between users
public Transaction transferCoins(User fromUser, User toUser,
    Double amount, TransactionType type, String description)
```

**Validations:**

- Amount must be positive
- Sender must have sufficient balance
- Cannot transfer to self
- Atomic balance updates

**Transaction Types:**

- `REWARD_PAYMENT` - Item return rewards
- `TIP` - User-to-user tips
- `QUEST_REWARD` - Quest completion
- `PURCHASE` - Coin purchases
- `DAILY_BONUS` - Daily login bonus
- `PENALTY` - Penalties

**User Fields:**

```java
Double coins;              // Current balance
Double lifetimeEarnings;   // Total earned
Double lifetimeSpent;      // Total spent
```

**Result:** ✅ Complete currency system with full transaction tracking and validation

---

## Issue #7: CORS Configuration for Frontend Integration

### Problem

- Frontend requests blocked by CORS policy
- Multiple frontend ports needed (dev, test, production)
- Preflight OPTIONS requests failing

### Approaches Tried

1. **Allow all origins** - Security risk
2. **Hardcoded single origin** - Inflexible
3. **Configurable multiple origins** - Final solution

### Best Fix Applied

Configured CORS in `SecurityConfig.java`:

**Configuration:**

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        allowedOrigins.split(",")
    ));
    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
    ));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    configuration.setAllowCredentials(true);
}
```

**Application.yml:**

```yaml
cors:
  allowed-origins: http://localhost:3000,http://localhost:3001,http://localhost:3002
```

**Security Filter:**

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
    // ... other rules
)
```

**Result:** ✅ Flexible CORS configuration supporting multiple frontend environments

---

## Issue #8: Quest System and Progress Tracking

### Problem

- Need gamification to encourage user engagement
- Track user progress across multiple quests
- Award rewards automatically on completion

### Approaches Tried

1. **Manual progress tracking** - Prone to errors
2. **Event-driven updates** - Complex
3. **Service-based progress tracking** - Final solution

### Best Fix Applied

Implemented quest system with `QuestService.java`:

**Models:**

- `Quest` - Quest definition (requirements, rewards)
- `UserQuest` - User progress tracking

**Quest Types:**

```java
enum QuestType {
    REPORT_ITEM,    // Report X items
    RETURN_ITEM,    // Return X items
    CLAIM_ITEM,     // Make X claims
    EARN_COINS,     // Earn X coins
    HELP_USERS      // Help X users
}
```

**Progress Flow:**

1. User starts quest → Create `UserQuest` record
2. User performs actions → Update progress
3. Progress meets requirement → Auto-complete
4. Completion triggers → Award coins + badge

**Reward System:**

```java
public QuestResponse completeQuest(String questId) {
    // Validate quest completion
    // Award coins via CurrencyService
    // Add badge to user profile
    // Update quest status to COMPLETED
    // Increment user's questsCompletedCount
}
```

**Result:** ✅ Engaging quest system with automatic progress tracking and rewards

---

## Issue #9: Leaderboard Performance

### Problem

- Ranking calculation needed for all users
- Real-time rank updates required
- Pagination for large user bases

### Approaches Tried

1. **Calculate rank on every request** - Too slow
2. **Cache all rankings** - Stale data issues
3. **Sort + paginate with MongoDB** - Final solution

### Best Fix Applied

Optimized leaderboard in `LeaderboardService.java`:

**Sorting Strategy:**

```java
Query query = new Query()
    .with(Sort.by(Sort.Direction.DESC, "score")
        .and(Sort.by(Sort.Direction.DESC, "itemsReturnedCount")));
```

**Rank Calculation:**

```java
// For current user rank
long usersAbove = userRepository.countUsersWithHigherScore(
    currentUser.getScore(),
    currentUser.getItemsReturnedCount()
);
int rank = (int) usersAbove + 1;
```

**Pagination:**

```java
Pageable pageable = PageRequest.of(page - 1, pageSize);
Page<User> userPage = userRepository.findAll(query, pageable);
```

**Result:** ✅ Fast leaderboard with efficient ranking and pagination

---

## Issue #10: API Response Standardization

### Problem

- Inconsistent response formats across endpoints
- Difficult to handle errors on frontend
- No pagination metadata

### Approaches Tried

1. **Direct model returns** - Inconsistent
2. **Custom response per endpoint** - Duplicate code
3. **Generic ApiResponse wrapper** - Final solution

### Best Fix Applied

Created `ApiResponse` DTO:

**Response Structure:**

```java
@Data
@Builder
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String error;
    private MetaData meta;

    @Data
    @Builder
    public static class MetaData {
        private Integer page;
        private Integer pageSize;
        private Long total;
    }
}
```

**Usage:**

```java
// Success response
return ResponseEntity.ok(ApiResponse.success(data));

// Success with pagination
return ResponseEntity.ok(ApiResponse.success(data, meta));

// Error response
return ResponseEntity.badRequest()
    .body(ApiResponse.error("Error message"));
```

**Example Response:**

```json
{
  "success": true,
  "data": {...},
  "error": null,
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 45
  }
}
```

**Result:** ✅ Consistent API responses across all endpoints

---

## Issue #11: Documentation and API Discoverability

### Problem

- No API documentation for frontend developers
- Manual testing difficult
- Unclear endpoint contracts

### Approaches Tried

1. **Manual README** - Gets outdated quickly
2. **Postman collection** - Separate from code
3. **OpenAPI/Swagger** - Final solution

### Best Fix Applied

Integrated Springdoc OpenAPI:

**Dependencies:**

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

**Configuration:**

```yaml
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
```

**Access Points:**

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

**Features:**

- Auto-generated from controllers
- Interactive API testing
- Request/response examples
- Always up-to-date with code

**Result:** ✅ Comprehensive auto-generated API documentation

---

## Issue #12: Script Execution Permissions

### Problem

- Shell scripts not executable by default
- Users getting "permission denied" errors
- Inconsistent across different systems

### Solution Applied

Made all shell scripts executable:

**Commands:**

```bash
chmod +x restart-backend.sh
chmod +x backend/setup.sh
chmod +x backend/start.sh
chmod +x add-mock-data.sh
chmod +x update-database.sh
chmod +x test-api.sh
```

**Git Configuration:**

```bash
git update-index --chmod=+x restart-backend.sh
```

**Result:** ✅ Scripts executable without manual chmod

---

## Summary of Key Learnings

### Architecture Decisions

✅ Layered architecture (Controller → Service → Repository)
✅ DTO pattern for API contracts
✅ Transaction management for data consistency
✅ Dual authentication for flexibility

### Performance Optimizations

✅ MongoDB indexing on frequently queried fields
✅ Pagination for all list endpoints
✅ Connection pooling
✅ Efficient sorting for leaderboard

### Security Measures

✅ BCrypt password hashing
✅ JWT token signing
✅ CORS configuration
✅ Input validation
✅ Authentication filters

### Developer Experience

✅ Comprehensive documentation
✅ OpenAPI/Swagger integration
✅ Automated restart scripts
✅ Consistent error handling
✅ Type-safe enums

### Best Practices Followed

✅ Single Responsibility Principle
✅ Dependency Injection
✅ Exception handling
✅ Logging
✅ Validation
✅ Transaction boundaries

---

## Technologies & Versions

- **Java:** 17
- **Spring Boot:** 3.2.1
- **MongoDB:** Atlas Cloud
- **Maven:** 3.x
- **JWT:** io.jsonwebtoken 0.12.3
- **Lombok:** Latest
- **OpenAPI:** springdoc 2.3.0

---

## Future Improvements

1. **Caching:** Redis for frequently accessed data
2. **Testing:** Unit and integration tests
3. **Monitoring:** Application performance monitoring
4. **Rate Limiting:** Prevent API abuse
5. **Email Notifications:** For claim status updates
6. **Image Upload:** S3 or cloud storage integration
7. **Search:** Elasticsearch for advanced search
8. **Analytics:** User behavior tracking

---

**Created:** December 19, 2025
**Last Updated:** December 19, 2025
