package com.lostcity.kafka.events;

import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Published to topic: reward-transferred
 * Fired after CurrencyService.transferCoins() succeeds and the claim is COMPLETED.
 * Consumer marks the LostReport as fully resolved.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardTransferredEvent {

    @Builder.Default
    private String eventId = UUID.randomUUID().toString();

    @Builder.Default
    private Instant timestamp = Instant.now();

    /** Clerk user ID of the owner (coin sender) */
    private String userId;

    /** MongoDB ID of the completed Claim */
    private String claimId;

    /** MongoDB ID of the LostReport — now CLOSED */
    private String lostReportId;

    /** Clerk user ID of the finder who received the reward */
    private String receiverId;

    /** Amount of LostCity Coins transferred */
    private Double rewardAmount;

    /** Human-readable description, e.g. "Reward for returning: Laptop Bag" */
    private String description;

    /** REWARD, PURCHASE, etc. — mirrors Transaction.TransactionType */
    private String transactionType;
}
