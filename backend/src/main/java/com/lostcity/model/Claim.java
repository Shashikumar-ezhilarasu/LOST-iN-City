package com.lostcity.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;

@Document(collection = "claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Claim {

    @Id
    private String id;

    @DBRef
    private LostReport lostReport;

    @DBRef
    private FoundReport foundReport;

    @DBRef
    private User claimer; // Person who found the item

    @DBRef
    private User owner; // Person who lost the item

    @Builder.Default
    private ClaimStatus status = ClaimStatus.PENDING;

    private String claimerMessage; // Message from finder to owner

    private String ownerResponse; // Response from owner

    private Double rewardAmount; // Reward amount for this claim

    @Builder.Default
    private Boolean rewardPaid = false;

    @CreatedDate
    private OffsetDateTime createdAt;

    @LastModifiedDate
    private OffsetDateTime updatedAt;

    private OffsetDateTime approvedAt;

    private OffsetDateTime rejectedAt;

    public enum ClaimStatus {
        PENDING, // Claim submitted, waiting for owner review
        APPROVED, // Owner confirmed this is the right person/item
        REJECTED, // Owner rejected the claim
        COMPLETED // Reward paid, item returned
    }
}
