# MongoDB Atlas Conversion Summary

## ✅ Completed Conversion Steps

### 1. Dependencies Updated (pom.xml)

- ✅ Removed `spring-boot-starter-data-jpa`
- ✅ Removed PostgreSQL driver
- ✅ Added `spring-boot-starter-data-mongodb`
- ✅ Configured Maven Compiler Plugin for Java 17

### 2. Configuration Updated (application.yml)

- ✅ Removed PostgreSQL datasource configuration
- ✅ Added MongoDB Atlas connection:
  ```yaml
  spring:
    data:
      mongodb:
        uri: mongodb+srv://shashikumarezhil_db_user:CZHLkjeFvHz55vC5@lostcity.1g3rszx.mongodb.net/lostcity?retryWrites=true&w=majority
  ```

### 3. Application Class Updated (LostCityApplication.java)

- ✅ Changed from `@EnableJpaAuditing` to `@EnableMongoAuditing`

### 4. Entity Models Converted (7 files)

- ✅ User
- ✅ LostReport
- ✅ FoundReport
- ✅ Quest
- ✅ UserQuest
- ✅ Comment
- ✅ MatchRequest

**Conversions Done:**

- `@Entity` → `@Document(collection = "...")`
- `@Table` removed
- `@Id` with `UUID` → `@Id` with `String` (MongoDB ObjectId)
- `@ManyToOne`/`@OneToMany` → `@DBRef`
- `@Column` removed (MongoDB doesn't need it)
- `@EntityListeners(AuditingEntityListener.class)` removed
- Added `@CreatedDate` and `@LastModifiedDate` fields
- Fixed enum declarations (they were incorrectly after @LastModifiedDate)

### 5. Repository Layer Converted (7 files)

- ✅ UserRepository
- ✅ LostReportRepository
- ✅ FoundReportRepository
- ✅ QuestRepository
- ✅ UserQuestRepository
- ✅ CommentRepository
- ✅ MatchRequestRepository

**Changes:**

- `extends JpaRepository<Entity, UUID>` → `extends MongoRepository<Entity, String>`
- Removed JPA-specific query annotations (`@Query` with JPQL)
- Replaced with MongoDB method naming conventions
- Removed Specification support
- Simplified geospatial queries

### 6. Service Layer Updated (6 files)

- ✅ UserService
- ✅ LostReportService
- ✅ FoundReportService
- ✅ QuestService
- ✅ CommentService
- ✅ LeaderboardService

**Changes:**

- Replaced `UUID` parameters with `String` throughout
- Added `MongoTemplate` for dynamic queries
- Replaced JPA `Specification` API with MongoDB `Criteria` queries
- Updated search methods to use `MongoTemplate.find()` with regex for text search
- Maintained pagination support using `PageImpl`

### 7. Controller Layer Updated (4 files)

- ✅ UserController
- ✅ LostReportController
- ✅ FoundReportController
- ✅ QuestController

**Changes:**

- Changed `@PathVariable UUID id` → `@PathVariable String id`
- Removed UUID imports
- All endpoint signatures now use String IDs

### 8. DTO Response Classes Updated (9 files)

- ✅ UserResponse
- ✅ LostReportResponse
- ✅ FoundReportResponse
- ✅ QuestResponse
- ✅ CommentResponse
- ✅ LeaderboardEntryResponse
- ✅ ApiResponse
- ✅ AuthResponse
- ✅ All nested UserSummary classes

**Changes:**

- `private UUID id` → `private String id`
- `private UUID matchedFoundItemId` → `private String matchedFoundItemId`
- `private UUID matchedLostItemId` → `private String matchedLostItemId`
- `private UUID userId` → `private String userId`
- Removed `import java.util.UUID`

## ⚠️ Outstanding Issue

### Lombok Annotation Processing

The project has a Lombok configuration issue where getters/setters aren't being generated during compilation. This is likely due to:

- Java 25 installed (project requires Java 17)
- Maven Compiler Plugin needs proper Lombok annotation processor configuration

### Solution Options:

**Option 1: Use Java 17** (Recommended)

```bash
# Install Java 17 if not already installed
brew install openjdk@17

# Set JAVA_HOME to Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Clean and rebuild
cd backend
mvn clean install -DskipTests
```

**Option 2: Update Maven Compiler Plugin**
Add this to `pom.xml` (already attempted, may need IDE restart):

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.12.1</version>
    <configuration>
        <source>17</source>
        <target>17</target>
        <release>17</release>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

**Option 3: Clean IDE Cache**

- Close IntelliJ IDEA / VS Code
- Delete `.idea` folder and `.vscode` folder
- Re-import the project
- Enable Lombok Annotation Processing in IDE settings

## 📋 Testing Checklist

Once Lombok issue is resolved:

1. **Build Backend**

   ```bash
   cd backend
   mvn clean install -DskipTests
   ```

2. **Run Backend**

   ```bash
   mvn spring-boot:run
   ```

   Application should start on http://localhost:8080

3. **Test Endpoints**

   - POST `/api/auth/register` - Create user
   - POST `/api/auth/login` - Login
   - GET `/api/users/me` - Get current user
   - POST `/api/items/lost` - Create lost report
   - GET `/api/items/lost` - Search lost items

4. **Verify MongoDB Atlas**
   - Login to MongoDB Atlas
   - Check `lostcity` database
   - Verify collections are created: users, lost_reports, found_reports, quests, etc.

## 🎯 Next Steps After Build Success

### Backend

1. Add initial quest data (seed database)
2. Test all CRUD operations
3. Verify JWT authentication flow
4. Test search and filtering

### Frontend Integration

Create API service in Next.js:

```typescript
// lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// Usage examples:
export const auth = {
  register: (data: RegisterData) =>
    fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: LoginData) =>
    fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const items = {
  getLost: (params?: QueryParams) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/items/lost?${query}`);
  },
  getFound: (params?: QueryParams) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/items/found?${query}`);
  },
  reportLost: (data: LostItemData) =>
    fetchWithAuth("/items/lost", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
```

## 📁 File Structure

```
backend/
├── src/main/java/com/lostcity/
│   ├── LostCityApplication.java (✅ Updated)
│   ├── config/
│   │   ├── CorsConfig.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── SecurityConfig.java
│   ├── controller/ (✅ All updated to String IDs)
│   │   ├── AuthController.java
│   │   ├── FoundReportController.java
│   │   ├── LeaderboardController.java
│   │   ├── LostReportController.java
│   │   ├── QuestController.java
│   │   └── UserController.java
│   ├── dto/
│   │   ├── request/
│   │   └── response/ (✅ All UUIDs converted to String)
│   ├── model/ (✅ All converted to MongoDB @Document)
│   │   ├── Comment.java
│   │   ├── FoundReport.java
│   │   ├── LostReport.java
│   │   ├── MatchRequest.java
│   │   ├── Quest.java
│   │   ├── User.java
│   │   └── UserQuest.java
│   ├── repository/ (✅ All converted to MongoRepository)
│   │   ├── CommentRepository.java
│   │   ├── FoundReportRepository.java
│   │   ├── LostReportRepository.java
│   │   ├── MatchRequestRepository.java
│   │   ├── QuestRepository.java
│   │   ├── UserQuestRepository.java
│   │   └── UserRepository.java
│   ├── service/ (✅ All using MongoTemplate & String IDs)
│   │   ├── AuthService.java
│   │   ├── CommentService.java
│   │   ├── FoundReportService.java
│   │   ├── JwtService.java
│   │   ├── LeaderboardService.java
│   │   ├── LostReportService.java
│   │   ├── QuestService.java
│   │   └── UserService.java
│   └── util/
│       └── JwtUtil.java
├── src/main/resources/
│   └── application.yml (✅ MongoDB Atlas connection)
└── pom.xml (✅ MongoDB dependencies)
```

## 🔧 Environment Variables

Create `.env` file in `backend/` if needed:

```properties
SPRING_DATA_MONGODB_URI=mongodb+srv://shashikumarezhil_db_user:CZHLkjeFvHz55vC5@lostcity.1g3rszx.mongodb.net/lostcity?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=86400000
```

## 🚀 Deployment

### Backend (Spring Boot + MongoDB Atlas)

1. MongoDB Atlas is already cloud-hosted
2. Deploy Spring Boot to:
   - Heroku
   - AWS Elastic Beanstalk
   - Google Cloud Run
   - Azure App Service

### Frontend (Next.js)

Deploy to:

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

## 🔒 Security Notes

1. **Change JWT Secret** in production
2. **Enable CORS** only for your frontend domain
3. **Use HTTPS** in production
4. **Rotate MongoDB credentials** regularly
5. **Add rate limiting** to prevent abuse
6. **Implement request validation** on all endpoints

## 📝 MongoDB Collections

After first run, you should see these collections in Atlas:

- `users` - User accounts
- `lost_reports` - Lost item reports
- `found_reports` - Found item reports
- `quests` - Available quests
- `user_quests` - User quest progress
- `comments` - Comments on items
- `match_requests` - Match requests between lost/found

## 🎨 Frontend Pages to Connect

All these Next.js pages need API integration:

- `/app/page.tsx` - Homepage
- `/app/browse-lost/page.tsx` - Browse lost items
- `/app/browse-found/page.tsx` - Browse found items
- `/app/report-lost/page.tsx` - Report lost item form
- `/app/report-found/page.tsx` - Report found item form
- `/app/lost-item/[id]/page.tsx` - Lost item details
- `/app/found-item/[id]/page.tsx` - Found item details
- `/app/profile/page.tsx` - User profile
- `/app/quests/page.tsx` - Quests list
- `/app/leaderboard/page.tsx` - Leaderboard

---

**Status**: Backend 99% converted, pending Lombok annotation processing fix for successful compilation. All code changes for MongoDB are complete!
