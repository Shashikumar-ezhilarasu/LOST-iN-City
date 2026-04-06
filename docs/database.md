# 💾 MongoDB Database Model

The **Lost & Found Quest** platform uses MongoDB to provide a flexible and scalable data architecture. This is ideal for handling rich item descriptions, varying metadata, and the evolving gamification system.

## 🏗️ NoSQL Schema Benefits

- **Flexible Collections**: Items can have different fields (e.g., electronic items have serial numbers, documents have names).
- **Embedded Documents**: Efficiently storing categories, locations, and user stats without complex joins.
- **Scalability**: High-performance reads/writes for real-time tracking and a global leaderboard.

## 🗄️ Core Collections

### 1. Users (`users`)
Stores user profiles, achievement statistics, and gamification data.
- `clerkUserId`: Unique identifier from Clerk Auth.
- `coins`: Virtual currency balance.
- `xp`: Total experience points.
- `level`: Calculated level based on XP.
- `stats`: Objects containing `itemsFound`, `itemsReturned`, etc.

### 2. Lost Reports (`lost_reports`)
Stores reports submitted by users who have lost an item.
- `title`, `description`, `category`.
- `rewardAmount`: The bounty offered for the item.
- `location`: Coordinates and human-readable address.
- `status`: `ACTIVE`, `CLAIMED`, `RETURNED`, `CANCELLED`.

### 3. Found Reports (`found_reports`)
Stores reports submitted by finders.
- `title`, `description`, `dateFound`.
- `location`: Where the item was discovered.
- `finderId`: Reference to the user who posted it.
- `images`: Array of secure URLs (S3/Cloudinary).

### 4. Claims (`claims`)
Manages the verification process between an owner and a finder.
- `lostReportId`, `foundReportId`.
- `status`: `PENDING`, `VERIFIED`, `APPROVED`, `COMPLETED`.
- `ownerId`, `finderId`.
- `verificationAnswers`: User-submitted proof of ownership.

### 5. Quests (`quests` & `user_quests`)
Defines the challenges and tracks user progress.
- `name`, `description`, `xpReward`, `coinReward`.
- `completionStatus`: Tracked on a per-user basis.

## 💻 Technical Implementation

### Spring Data MongoDB
We use **Spring Data MongoDB** for seamless Java-to-Mongo mapping.

**Example Entity:**
```java
@Document(collection = "lost_reports")
public class LostReport {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private Double rewardAmount;
    private String status;
    private LocalDateTime createdAt;
    // Getters and Setters
}
```

### Configuration
Connection strings are managed via environment variables in `backend/src/main/resources/application.yml`:
```yaml
spring:
  data:
    mongodb:
      uri: ${MONGODB_URI}
      database: ${MONGODB_DATABASE:lostcity}
```

## 🔐 Security & Persistence
- **Indexes**: Critical fields like `clerkUserId` and `status` are indexed for fast lookup.
- **Auditing**: Every document includes `createdAt` and `updatedAt` timestamps.
- **Validation**: Data integrity is enforced at the service layer using Spring Validator.

---
**Happy Querying! 💾**
