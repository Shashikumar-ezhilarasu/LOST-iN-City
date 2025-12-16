# LostCity Backend - Setup Complete ✅

## Build Status

✅ **Successfully compiled with Java 21**

## Fixed Issues

1. ✅ Java version compatibility - Using Java 21 (Java 17 not needed)
2. ✅ Lombok annotation processing - Added to maven-compiler-plugin
3. ✅ QuestService Page conversion error - Fixed with PageImpl
4. ✅ All MongoDB conversions complete
5. ✅ Path with spaces handled correctly

## Database Configuration

- **MongoDB Atlas URI**: `mongodb+srv://shashikumarezhil_db_user:CZHLkjeFvHz55vC5@lostcity.1g3rszx.mongodb.net/lostcity`
- Configuration file: `src/main/resources/application.yml`

## How to Run

### Option 1: Use the startup script (recommended)

```bash
./start.sh
```

### Option 2: Manual command

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
cd backend
mvn spring-boot:run
```

### Option 3: Run the JAR

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
java -jar target/lost-city-backend-1.0.0.jar
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Lost Reports

- GET `/api/lost-reports` - List all lost reports (paginated, searchable)
- POST `/api/lost-reports` - Create lost report
- GET `/api/lost-reports/{id}` - Get lost report details
- PATCH `/api/lost-reports/{id}/status` - Update status
- DELETE `/api/lost-reports/{id}` - Delete report

### Found Reports

- GET `/api/found-reports` - List all found reports (paginated, searchable)
- POST `/api/found-reports` - Create found report
- GET `/api/found-reports/{id}` - Get found report details
- PATCH `/api/found-reports/{id}/status` - Update status
- DELETE `/api/found-reports/{id}` - Delete report

### Matches

- POST `/api/matches` - Create match request
- GET `/api/matches/user` - Get user's matches
- PATCH `/api/matches/{id}/accept` - Accept match
- PATCH `/api/matches/{id}/reject` - Reject match

### Quests

- GET `/api/quests` - List quests (filter by status)
- POST `/api/quests/{id}/start` - Start a quest
- POST `/api/quests/{id}/complete` - Complete a quest

### Comments

- POST `/api/comments` - Add comment to report
- GET `/api/comments/{reportType}/{reportId}` - Get comments for report

### Leaderboard

- GET `/api/leaderboard` - Get top users by karma

### User Profile

- GET `/api/users/profile` - Get user profile
- PATCH `/api/users/profile` - Update profile

## Next Steps

### 1. Test Backend

Start the backend and test with curl or Postman:

```bash
./start.sh
```

Test health:

```bash
curl http://localhost:8080/actuator/health
```

### 2. Frontend Integration

Create API client in Next.js:

- Create `lib/api.ts` with typed fetch wrappers
- Add authentication context
- Connect pages to backend endpoints

### 3. Environment Variables

For production, use environment variables instead of hardcoded MongoDB URI:

```yaml
spring:
  data:
    mongodb:
      uri: ${MONGODB_URI}
```

## Port

Backend runs on: **http://localhost:8080**

## Notes

- JWT secret: Change in production (`jwt.secret` in application.yml)
- All IDs are now String type (MongoDB ObjectId)
- File uploads are base64 encoded in database
