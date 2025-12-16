package com.lostcity.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;

@Document(collection = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    private String id;

    @DBRef
    private User fromUser; // Null for reward release (system)

    @DBRef
    private User toUser; // Recipient of funds

    private Double amount;

    @Builder.Default
    private TransactionType type = TransactionType.REWARD;

    @Builder.Default
    private TransactionStatus status = TransactionStatus.COMPLETED;

    private String description;

    private String relatedClaimId; // Reference to claim if applicable

    private String relatedLostReportId; // Reference to lost report

    private String relatedQuestId; // Reference to quest if applicable

    private String metadata; // JSON string for additional data

    @CreatedDate
    private OffsetDateTime createdAt;

    public enum TransactionType {
        REWARD, // Reward payment for finding item
        QUEST_REWARD, // Reward from completing quests
        REFUND, // Reward refund if claim rejected
        TIP, // User-to-user tip/donation
        PURCHASE, // Purchase items in marketplace
        ADMIN_CREDIT, // Admin added coins
        ADMIN_DEBIT, // Admin removed coins
        BONUS, // Bonus coins (daily login, special events)
        TRANSFER // Transfer between users
    }

    public enum TransactionStatus {
        PENDING, // Transaction initiated but not complete
        COMPLETED, // Transaction successful
        FAILED, // Transaction failed
        CANCELLED // Transaction cancelled
    }
}
