package com.lostcity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoundReportResponse {
    private UUID id;
    private String title;
    private String description;
    private String category;
    private List<String> images;
    private List<String> tags;
    private String color;
    private String brand;
    private Double latitude;
    private Double longitude;
    private String locationName;
    private String status;
    private OffsetDateTime foundAt;
    private UserSummary reportedBy;
    private String foundCondition;
    private String holdingInstructions;
    private UUID matchedLostItemId;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private UUID id;
        private String displayName;
        private String avatarUrl;
    }
}
