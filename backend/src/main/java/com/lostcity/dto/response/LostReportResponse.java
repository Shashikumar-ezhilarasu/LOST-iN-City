package com.lostcity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LostReportResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private List<String> images;
    private List<String> tags;
    private String color;
    private String brand;
    private Double rewardAmount;
    private Double latitude;
    private Double longitude;
    private String locationName;
    private String status;
    private OffsetDateTime lostAt;
    private UserSummary reportedBy;
    private String visibility;
    private String matchedFoundItemId;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private String id;
        private String displayName;
        private String avatarUrl;
    }
}
