package com.lostcity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryResponse {
    private UUID userId;
    private String displayName;
    private String avatarUrl;
    private Integer score;
    private Integer rank;
    private Integer foundReportsCount;
    private Integer lostReportsCount;
    private Integer questsCompletedCount;
}
