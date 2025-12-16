package com.lostcity.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "found_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoundReport {

    @Id
    private String id;

    private String title;

    private String description;

    private String category;

    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    private String color;
    private String brand;

    private Double latitude;

    private Double longitude;

    private String locationName;

    @Builder.Default
    private ItemStatus status = ItemStatus.OPEN;

    private OffsetDateTime foundAt;

    @DBRef
    private User reportedBy;

    private Condition foundCondition;

    private String holdingInstructions;

    private String matchedLostItemId;

    @CreatedDate
    private OffsetDateTime createdAt;

    @LastModifiedDate
    private OffsetDateTime updatedAt;

    public enum ItemStatus {
        OPEN, MATCHED, CLOSED
    }

    public enum Condition {
        NEW, GOOD, WORN, DAMAGED
    }
}
