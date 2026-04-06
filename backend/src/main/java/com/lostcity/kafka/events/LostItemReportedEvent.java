package com.lostcity.kafka.events;

import lombok.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Published to topic: lost-item-reported
 * Fired immediately after a LostReport document is persisted in MongoDB.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostItemReportedEvent {

    /** Unique ID for this event (idempotency key) */
    @Builder.Default
    private String eventId = UUID.randomUUID().toString();

    /** UTC timestamp of the moment the event was created */
    @Builder.Default
    private Instant timestamp = Instant.now();

    /** Clerk user ID of the person who filed the lost report */
    private String userId;

    /** MongoDB ID of the newly created LostReport document */
    private String itemId;

    private String title;
    private String category;

    /** Optional reward amount set by the owner (may be null) */
    private Double rewardAmount;

    private String locationName;
    private Double latitude;
    private Double longitude;

    /** Tags help downstream services (e.g. matching engine) index the item */
    private List<String> tags;

    /** PUBLIC or PRIVATE */
    private String visibility;
}
