package com.lostcity.kafka.consumer;

import com.lostcity.kafka.events.*;
import com.lostcity.model.LostReport;
import com.lostcity.model.User;
import com.lostcity.repository.LostReportRepository;
import com.lostcity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

/**
 * Kafka consumer service.
 *
 * Each @KafkaListener maps to exactly one topic.
 * groupId = "lost-city-group" is shared across all listeners so that
 * each message is processed by only one instance in a multi-node deployment.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final UserRepository userRepository;
    private final LostReportRepository lostReportRepository;

    // ─── lost-item-reported ───────────────────────────────────────────────────

    /**
     * Fanout hook for future ML-based matching pipeline.
     * Currently logs receipt and can forward to an elasticSearch indexer.
     */
    @KafkaListener(topics = "lost-item-reported", groupId = "lost-city-group",
            containerFactory = "kafkaListenerContainerFactory")
    public void onLostItemReported(@Payload LostItemReportedEvent event) {
        log.info("[Kafka] 📥 lost-item-reported | eventId={} itemId='{}' userId='{}' category='{}' reward={}",
                event.getEventId(), event.getItemId(), event.getUserId(),
                event.getCategory(), event.getRewardAmount());

        // TODO: Forward to item-matching service or search index
    }

    // ─── found-item-posted ────────────────────────────────────────────────────

    @KafkaListener(topics = "found-item-posted", groupId = "lost-city-group",
            containerFactory = "kafkaListenerContainerFactory")
    public void onFoundItemPosted(@Payload FoundItemPostedEvent event) {
        log.info("[Kafka] 📥 found-item-posted | eventId={} itemId='{}' userId='{}' condition='{}'",
                event.getEventId(), event.getItemId(), event.getUserId(), event.getFoundCondition());

        // TODO: Cross-match with open lost reports in the same category/location
    }

    // ─── claim-submitted ──────────────────────────────────────────────────────

    @KafkaListener(topics = "claim-submitted", groupId = "lost-city-group",
            containerFactory = "kafkaListenerContainerFactory")
    public void onClaimSubmitted(@Payload ClaimSubmittedEvent event) {
        log.info("[Kafka] 📥 claim-submitted | eventId={} claimId='{}' lostReportId='{}' ownerId='{}'",
                event.getEventId(), event.getClaimId(), event.getLostReportId(), event.getOwnerId());

        // TODO: Send in-app notification to the item owner (ownerId)
        log.info("[Kafka] 🔔 Notification stub → owner '{}' has a new claim on item '{}'",
                event.getOwnerId(), event.getLostReportId());
    }

    // ─── claim-approved ───────────────────────────────────────────────────────

    /**
     * Triggered when an owner approves a claim.
     * Sends a notification log to the finder (claimerId) and can trigger
     * an email/push notification via future notification service.
     */
    @KafkaListener(topics = "claim-approved", groupId = "lost-city-group",
            containerFactory = "kafkaListenerContainerFactory")
    public void onClaimApproved(@Payload ClaimApprovedEvent event) {
        log.info("[Kafka] 📥 claim-approved | eventId={} claimId='{}' claimerId='{}' reward={}",
                event.getEventId(), event.getClaimId(), event.getClaimerId(), event.getRewardAmount());

        // Notify the finder that their claim was approved
        log.info("[Kafka] 🔔 Notification stub → claimer '{}' — your claim '{}' was APPROVED! " +
                        "You will receive {:.2f} coins once the owner completes the handoff.",
                event.getClaimerId(), event.getClaimId(), event.getRewardAmount());

        // TODO: Integrate with email/push service (Firebase, SendGrid, etc.)
    }

    // ─── reward-transferred ───────────────────────────────────────────────────

    /**
     * Marks the LostReport as fully resolved in MongoDB after
     * the coin transfer is confirmed. This is the final lifecycle step.
     */
    @KafkaListener(topics = "reward-transferred", groupId = "lost-city-group",
            containerFactory = "kafkaListenerContainerFactory")
    public void onRewardTransferred(@Payload RewardTransferredEvent event) {
        log.info("[Kafka] 📥 reward-transferred | eventId={} claimId='{}' lostReportId='{}' amount={}",
                event.getEventId(), event.getClaimId(), event.getLostReportId(), event.getRewardAmount());

        // Idempotent guard: only update if the report is not already CLOSED
        lostReportRepository.findById(event.getLostReportId()).ifPresentOrElse(report -> {
            if (report.getStatus() != LostReport.ItemStatus.CLOSED) {
                report.setStatus(LostReport.ItemStatus.CLOSED);
                report.setRewardReleased(true);
                lostReportRepository.save(report);
                log.info("[Kafka] ✅ LostReport '{}' marked as CLOSED after reward transfer.",
                        event.getLostReportId());
            } else {
                // Already closed — idempotent, nothing to do
                log.debug("[Kafka] ⏭️  LostReport '{}' already CLOSED — skipping.", event.getLostReportId());
            }
        }, () -> log.warn("[Kafka] ⚠️  LostReport '{}' not found for reward-transferred event.",
                event.getLostReportId()));
    }

    // ─── xp-coins-updated ─────────────────────────────────────────────────────

    /**
     * Applies XP and coin deltas to the User document in MongoDB.
     * This keeps gamification decoupled from the core claim/reward flow.
     */
    @KafkaListener(topics = "xp-coins-updated", groupId = "lost-city-group",
            containerFactory = "kafkaListenerContainerFactory")
    public void onXpCoinsUpdated(@Payload XpCoinsUpdatedEvent event) {
        log.info("[Kafka] 📥 xp-coins-updated | eventId={} userId='{}' xpGained={} coinsGained={} reason='{}'",
                event.getEventId(), event.getUserId(), event.getXpGained(),
                event.getCoinsGained(), event.getReason());

        userRepository.findById(event.getUserId()).ifPresentOrElse(user -> {
            boolean changed = false;

            // Add XP (reputation score)
            if (event.getXpGained() != null && event.getXpGained() > 0) {
                user.setScore(user.getScore() + event.getXpGained());
                changed = true;
            }

            // Add coins (virtual currency)
            if (event.getCoinsGained() != null && event.getCoinsGained() > 0) {
                user.setCoins(user.getCoins() + event.getCoinsGained());
                user.setLifetimeEarnings(user.getLifetimeEarnings() + event.getCoinsGained());
                changed = true;
            }

            if (changed) {
                userRepository.save(user);
                log.info("[Kafka] 🎮 XP/Coins updated for user '{}' → score={} coins={}",
                        user.getId(), user.getScore(), user.getCoins());

                // TODO: Trigger badge evaluation (e.g., "First Finder" badge)
            }
        }, () -> log.warn("[Kafka] ⚠️  User '{}' not found for xp-coins-updated event.", event.getUserId()));
    }
}
