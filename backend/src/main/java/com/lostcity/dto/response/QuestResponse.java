package com.lostcity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestResponse {
    private String id;
    private String title;
    private String description;
    private String difficulty;
    private Integer rewardPoints;
    private OffsetDateTime expiresAt;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
