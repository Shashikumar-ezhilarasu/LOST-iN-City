package com.lostcity.kafka.events;

import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Published to topic: claim-submitted
 * Fired after a Claim document is persisted with status PENDING.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimSubmittedEvent {

    @Builder.Default
    private String eventId = UUID.randomUUID().toString();

    @Builder.Default
    private Instant timestamp = Instant.now();

    /** Clerk user ID of the finder (claimer) */
    private String userId;

    /** MongoDB ID of the newly created Claim document */
    private String claimId;

    /** MongoDB ID of the LostReport this claim is against */
    private String lostReportId;

    /** MongoDB ID of the FoundReport attached to this claim (nullable) */
    private String foundReportId;

    /** Clerk user ID of the item owner — useful for sending notifications */
    private String ownerId;

    /** Dynamically calculated reward at the time of claim creation */
    private Double rewardAmount;

    /** Optional message from the finder to the owner */
    private String claimerMessage;
}
