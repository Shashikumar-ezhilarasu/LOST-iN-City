package com.lostcity.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    // Alias for frontend compatibility
    @JsonProperty("itemName")
    public String getItemName() {
        return title;
    }

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

    // Alias for frontend compatibility
    @JsonProperty("lostLocation")
    public String getLostLocation() {
        return locationName;
    }

    // Alias for frontend compatibility
    @JsonProperty("lostDate")
    public OffsetDateTime getLostDate() {
        return lostAt;
    }

    // Support distinguishingFeatures (derived from tags)
    @JsonProperty("distinguishingFeatures")
    public List<String> getDistinguishingFeatures() {
        return tags != null ? tags : List.of();
    }

    private String status;
    private OffsetDateTime lostAt;
    private UserSummary reportedBy;
    private String visibility;
    private String matchedFoundItemId;
    private String approvedClaimId;
    private Boolean rewardReleased;
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
