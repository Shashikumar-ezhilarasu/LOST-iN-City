package com.lostcity.kafka.producer;

import com.lostcity.kafka.events.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Central Kafka producer service.
 *
 * Naming convention: one publish*() method per topic.
 * The userId is used as the partition key so all events for the same user
 * land on the same partition (preserving ordering per user).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    // ─── Topic name constants ─────────────────────────────────────────────────

    private static final String TOPIC_LOST_ITEM_REPORTED  = "lost-item-reported";
    private static final String TOPIC_FOUND_ITEM_POSTED   = "found-item-posted";
    private static final String TOPIC_CLAIM_SUBMITTED     = "claim-submitted";
    private static final String TOPIC_CLAIM_APPROVED      = "claim-approved";
    private static final String TOPIC_REWARD_TRANSFERRED  = "reward-transferred";
    private static final String TOPIC_XP_COINS_UPDATED    = "xp-coins-updated";

    // ─── Publish methods ──────────────────────────────────────────────────────

    /**
     * Publish after a LostReport is saved.
     *
     * @param itemId     MongoDB LostReport ID
     * @param userId     Clerk user ID of the reporter
     * @param title      item title
     * @param category   item category
     * @param reward     optional reward amount
     * @param location   human-readable location name
     * @param lat        latitude (nullable)
     * @param lon        longitude (nullable)
     * @param tags       item tags
     * @param visibility PUBLIC or PRIVATE
     */
    public void publishLostItemReported(
            String itemId, String userId, String title, String category,
            Double reward, String location, Double lat, Double lon,
            List<String> tags, String visibility) {

        LostItemReportedEvent event = LostItemReportedEvent.builder()
                .userId(userId)
                .itemId(itemId)
                .title(title)
                .category(category)
                .rewardAmount(reward)
                .locationName(location)
                .latitude(lat)
                .longitude(lon)
                .tags(tags)
                .visibility(visibility)
                .build();

        send(TOPIC_LOST_ITEM_REPORTED, userId, event);
    }

    /**
     * Publish after a FoundReport is saved.
     */
    public void publishFoundItemPosted(
            String itemId, String userId, String title, String category,
            String location, Double lat, Double lon,
            String foundCondition, List<String> tags) {

        FoundItemPostedEvent event = FoundItemPostedEvent.builder()
                .userId(userId)
                .itemId(itemId)
                .title(title)
                .category(category)
                .locationName(location)
                .latitude(lat)
                .longitude(lon)
                .foundCondition(foundCondition)
                .tags(tags)
                .build();

        send(TOPIC_FOUND_ITEM_POSTED, userId, event);
    }

    /**
     * Publish after a Claim is created with PENDING status.
     */
    public void publishClaimSubmitted(
            String claimId, String userId, String lostReportId,
            String foundReportId, String ownerId,
            Double rewardAmount, String claimerMessage) {

        ClaimSubmittedEvent event = ClaimSubmittedEvent.builder()
                .userId(userId)
                .claimId(claimId)
                .lostReportId(lostReportId)
                .foundReportId(foundReportId)
                .ownerId(ownerId)
                .rewardAmount(rewardAmount)
                .claimerMessage(claimerMessage)
                .build();

        send(TOPIC_CLAIM_SUBMITTED, userId, event);
    }

    /**
     * Publish after an owner approves a claim.
     */
    public void publishClaimApproved(
            String claimId, String userId, String lostReportId,
            String claimerId, Double rewardAmount, String ownerResponse) {

        ClaimApprovedEvent event = ClaimApprovedEvent.builder()
                .userId(userId)
                .claimId(claimId)
                .lostReportId(lostReportId)
                .claimerId(claimerId)
                .rewardAmount(rewardAmount)
                .ownerResponse(ownerResponse)
                .build();

        send(TOPIC_CLAIM_APPROVED, userId, event);
    }

    /**
     * Publish after CurrencyService.transferCoins() completes.
     */
    public void publishRewardTransferred(
            String claimId, String userId, String lostReportId,
            String receiverId, Double rewardAmount,
            String description, String transactionType) {

        RewardTransferredEvent event = RewardTransferredEvent.builder()
                .userId(userId)
                .claimId(claimId)
                .lostReportId(lostReportId)
                .receiverId(receiverId)
                .rewardAmount(rewardAmount)
                .description(description)
                .transactionType(transactionType)
                .build();

        send(TOPIC_REWARD_TRANSFERRED, userId, event);
    }

    /**
     * Publish whenever XP (reputation score) or coins are granted to a user.
     */
    public void publishXpCoinsUpdated(
            String userId, String clerkId, Integer xpGained,
            Double coinsGained, String reason, String relatedItemId) {

        XpCoinsUpdatedEvent event = XpCoinsUpdatedEvent.builder()
                .userId(userId)
                .clerkId(clerkId)
                .xpGained(xpGained)
                .coinsGained(coinsGained)
                .reason(reason)
                .relatedItemId(relatedItemId)
                .build();

        send(TOPIC_XP_COINS_UPDATED, userId, event);
    }

    // ─── Internal helper ──────────────────────────────────────────────────────

    /**
     * Generic send with async callback for logging.
     *
     * @param topic partition key (userId) ensures ordering per user
     */
    private void send(String topic, String key, Object payload) {
        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic, key, payload);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("[Kafka] ✅ Published to topic='{}' partition={} offset={} key='{}'",
                        topic,
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset(),
                        key);
            } else {
                // Non-blocking failure — log and let the caller continue
                log.error("[Kafka] ❌ Failed to publish to topic='{}' key='{}': {}",
                        topic, key, ex.getMessage(), ex);
            }
        });
    }
}
