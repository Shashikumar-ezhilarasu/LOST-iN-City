# 🖥️ Spring Boot Backend API

The **Lost & Found Quest** backend is a powerful RESTful API built with Spring Boot. It handles all business logic, data persistence, and security for the platform.

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.3.x
- **Language**: Java 21 (LTS)
- **Database**: MongoDB (NoSQL)
- **Security**: Spring Security + JSON Web Tokens (JWT) + Clerk Authentication
- **Event Streaming**: Apache Kafka
- **Build Tool**: Maven

## 📂 Project Structure

```
backend/
├── src/main/java/com/lostcity/
│   ├── config/             # Configuration (Security, Mongo, Kafka)
│   ├── controller/         # REST Controllers (API Endpoints)
│   ├── dto/                # Data Transfer Objects (Request/Response)
│   ├── exception/          # Global Exception Handling
│   ├── kafka/              # Kafka Setup (Producer, Consumer, Events)
│   ├── model/              # MongoDB Map Entities
│   ├── repository/         # Spring Data Mongo Repositories
│   ├── security/           # JWT & Clerk Integration
│   └── service/            # Core Business Logic
├── src/main/resources/
│   └── application.yml     # Environment and App Config
└── pom.xml                 # Maven Dependency Management
```

## 🚀 Local Development Setup

### 1. Prerequisites
- **Java 21**: Installed and configured in your path.
- **Maven**: To build and run the application.
- **MongoDB**: Access to a local or remote MongoDB instance (e.g., MongoDB Atlas).
- **Environment Variables**: Copy `.env.example` to `.env` in the `backend/` folder.

### 2. Startup Commands
Run the provided start script to load environment variables and launch the app:
```bash
./backend/start.sh
```
Or use Maven directly if variables are already set:
```bash
mvn spring-boot:run
```

## 🔐 Security & Authentication

The backend is secured using Clerk for user authentication and management. 

- **JWT Verification**: Incoming requests must include a valid Clerk JWT in the `Authorization` header.
- **Role-Based Access**: Restricted endpoints (like admin functions) require specific user roles or permissions.
- **Clerk Integration**: A dedicated `ClerkTokenVerifier` handles public key retrieval and JWT parsing.

## 📡 API Endpoints

Once the application is running, you can explore the API documentation:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

### Core Controllers
- `AuthController`: Handles user login, registration, and profile fetching.
- `LostReportController`: Manages posting and retrieving lost item reports.
- `FoundReportController`: Manages posting and searching found items.
- `ClaimController`: Orchestrates item claims and owner verification.
- `QuestController`: Manages gamification quests and daily rewards.

## 🔄 Business Logic Features

- **Gamification**: Automatic XP calculation and leveling based on user activity.
- **Real-time Events**: Every state-changing action triggers a Kafka event (e.g., `lost-item-reported`, `claim-approved`).
- **Flexible Data Model**: MongoDB allows for rich item descriptions and varied categorization.

---
**Happy Coding! 🗡️**
