# 📡 Apache Kafka Integration

The **Lost & Found Quest** platform utilizes Apache Kafka to implement an event-driven architecture. This ensures that the system is decoupled, scalable, and capable of real-time event processing for item tracking and notifications.

## 🏗️ Architecture Overview

Kafka acts as the central nervous system of the backend, capturing every significant state change as a durable event.

- **Producers**: Spring Boot controllers and services publish events when users report items, claim items, or approve claims.
- **Consumers**: Internal services listen for these events to update user XP, notify other users, and update the global leaderboard.
- **Broker**: A single-node Kafka broker (via Docker) manages the topics and message persistence.

## 🗂️ Kafka Topics

The system uses the following topics to categorize domain events:

| Topic | Description | Event Payload |
|-------|-------------|---------------|
| `lost-item-reported` | Published when a user submits a new lost item report. | `LostItemReportedEvent` |
| `found-item-posted` | Published when a user submits a new found item report. | `FoundItemPostedEvent` |
| `claim-submitted` | Published when a user attempts to claim a found item. | `ClaimSubmittedEvent` |
| `claim-approved` | Published when an owner verifies and approves a claim. | `ClaimApprovedEvent` |
| `reward-transferred` | Published after a successful item handover and reward payment. | `RewardTransferredEvent` |
| `xp-coins-updated` | Published when a user's gamification stats change. | `XpCoinsUpdatedEvent` |

## 🛠️ Local Development Setup

We use Docker to run a local Kafka stack including Zookeeper and a graphical UI.

### 1. Start the Stack
Navigate to the root directory and run:
```bash
bash run-all.sh
```
This script will start:
- **Zookeeper**: Manages Kafka cluster state.
- **Kafka Broker**: Handles message streaming (Port `9092`).
- **Kafka UI**: Graphical interface to inspect topics (Port `8090`).

### 2. Inspecting Events
Open [http://localhost:8090](http://localhost:8090) in your browser. Here you can:
- View all active topics.
- Inspect individual messages (JSON format).
- Monitor consumer group offsets.

## 💻 Technical Implementation

### Configuration
Kafka settings are defined in `backend/src/main/resources/application.yml`:
```yaml
spring:
  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    consumer:
      group-id: lost-city-group
      auto-offset-reset: earliest
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```

### Producer Example
Events are published using the `KafkaTemplate`:
```java
@Service
public class KafkaProducerService {
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void publishLostReport(LostReport report) {
        kafkaTemplate.send("lost-item-reported", new LostItemReportedEvent(report));
    }
}
```

### Consumer Example
Services listen for events using `@KafkaListener`:
```java
@Service
public class NotificationService {
    @KafkaListener(topics = "claim-approved", groupId = "notif-group")
    public void handleClaimApproved(ClaimApprovedEvent event) {
        // Logic to send push notification to the finder
    }
}
```

---
**Happy Streaming! 🚀**
