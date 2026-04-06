package com.lostcity.kafka.events;

import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Published to topic: claim-approved
 * Fired after the owner approves a claim; LostReport moves to MATCHED status.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimApprovedEvent {

    @Builder.Default
    private String eventId = UUID.randomUUID().toString();

    @Builder.Default
    private Instant timestamp = Instant.now();

    /** Clerk user ID of the item owner who approved */
    private String userId;

    /** MongoDB ID of the approved Claim */
    private String claimId;

    /** MongoDB ID of the LostReport (now in MATCHED status) */
    private String lostReportId;

    /** Clerk user ID of the claimer (finder) to notify */
    private String claimerId;

    /** Reward amount locked in at approval time */
    private Double rewardAmount;

    /** Optional response message from the owner */
    private String ownerResponse;
}
