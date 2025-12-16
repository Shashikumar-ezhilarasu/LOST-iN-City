# LostCity Backend

Spring Boot REST API for the LostCity application - a lost and found items management system with gamification features.

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Security with JWT**
- **Spring Data JPA**
- **PostgreSQL**
- **Maven**
- **Lombok**
- **Springdoc OpenAPI 3**

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+

## Getting Started

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE lostcity;
```

### 2. Configuration

Update `src/main/resources/application.yml` with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/lostcity
    username: your_username
    password: your_password
```

Generate a secure JWT secret (minimum 256 bits):

```bash
openssl rand -base64 64
```

Set it as an environment variable or update in `application.yml`:

```bash
export JWT_SECRET="your-generated-secret-key"
```

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will start on `http://localhost:8080`

## API Documentation

Once running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Users

- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update current user
- `GET /users/{id}` - Get user by ID

### Lost Items

- `POST /items/lost` - Report lost item
- `GET /items/lost` - Search lost items
- `GET /items/lost/{id}` - Get lost item details
- `POST /items/lost/{id}/comments` - Add comment
- `GET /items/lost/{id}/comments` - Get comments

### Found Items

- `POST /items/found` - Report found item
- `GET /items/found` - Search found items
- `GET /items/found/{id}` - Get found item details
- `POST /items/found/{id}/comments` - Add comment
- `GET /items/found/{id}/comments` - Get comments

### Quests

- `GET /quests` - Get available quests
- `POST /quests/{id}/start` - Start a quest
- `POST /quests/{id}/complete` - Complete a quest

### Leaderboard

- `GET /leaderboard` - Get leaderboard
- `GET /leaderboard/me` - Get current user rank

### Utilities

- `GET /categories` - Get available categories
- `GET /tags/suggest` - Get tag suggestions

## Authentication

The API uses JWT Bearer token authentication. Include the token in requests:

```
Authorization: Bearer <your-jwt-token>
```

### Register Example

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "display_name": "John Doe"
  }'
```

### Login Example

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

### Authenticated Request Example

```bash
curl -X GET http://localhost:8080/users/me \
  -H "Authorization: Bearer <your-token>"
```

## Response Format

All API responses follow this format:

```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100
  },
  "errors": []
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes:

- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

Error response format:

```json
{
  "data": null,
  "meta": null,
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Field is required",
      "field": "email"
    }
  ]
}
```

## Database Schema

The application automatically creates tables on startup. Main entities:

- `users` - User accounts and stats
- `lost_reports` - Lost item reports
- `found_reports` - Found item reports
- `quests` - Available quests
- `user_quests` - User quest progress
- `comments` - Comments on items
- `match_requests` - Match requests between lost/found items

## CORS Configuration

By default, CORS is enabled for `http://localhost:3000`. Update in `application.yml`:

```yaml
cors:
  allowed-origins: http://localhost:3000,https://your-frontend-domain.com
```

## Production Deployment

1. Set environment variables:

   ```bash
   export SPRING_PROFILES_ACTIVE=prod
   export JWT_SECRET="your-production-secret"
   export SPRING_DATASOURCE_URL="jdbc:postgresql://prod-host:5432/lostcity"
   export SPRING_DATASOURCE_USERNAME="prod_user"
   export SPRING_DATASOURCE_PASSWORD="prod_password"
   ```

2. Build for production:

   ```bash
   mvn clean package -DskipTests
   ```

3. Run the JAR:
   ```bash
   java -jar target/lost-city-backend-1.0.0.jar
   ```

## Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
