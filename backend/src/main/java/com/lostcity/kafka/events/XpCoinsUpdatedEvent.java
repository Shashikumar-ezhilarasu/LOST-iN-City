package com.lostcity.kafka.events;

import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Published to topic: xp-coins-updated
 * Fired whenever a gamification reward (XP score or coins) is granted to a user.
 * Consumer updates the User document in MongoDB and can trigger badge checks.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class XpCoinsUpdatedEvent {

    @Builder.Default
    private String eventId = UUID.randomUUID().toString();

    @Builder.Default
    private Instant timestamp = Instant.now();

    /** MongoDB User ID of the recipient */
    private String userId;

    /** Clerk user ID for cross-service correlation */
    private String clerkId;

    /** XP (reputation score) points to add; 0 if only coins changed */
    private Integer xpGained;

    /** LostCity Coins to add; 0 if only XP changed */
    private Double coinsGained;

    /**
     * Human-readable reason for the reward.
     * Examples: "ITEM_RETURNED", "QUEST_COMPLETED", "DAILY_LOGIN"
     */
    private String reason;

    /** Optional reference to the domain object that triggered this reward */
    private String relatedItemId;
}
