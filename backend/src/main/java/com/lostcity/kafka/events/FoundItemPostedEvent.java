package com.lostcity.kafka.events;

import lombok.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Published to topic: found-item-posted
 * Fired immediately after a FoundReport document is persisted in MongoDB.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoundItemPostedEvent {

    @Builder.Default
    private String eventId = UUID.randomUUID().toString();

    @Builder.Default
    private Instant timestamp = Instant.now();

    /** Clerk user ID of the finder who posted the found item */
    private String userId;

    /** MongoDB ID of the newly created FoundReport document */
    private String itemId;

    private String title;
    private String category;

    private String locationName;
    private Double latitude;
    private Double longitude;

    /** NEW, GOOD, WORN, DAMAGED — condition of the found item */
    private String foundCondition;

    /** Tags fed into the item-matching pipeline */
    private List<String> tags;
}
