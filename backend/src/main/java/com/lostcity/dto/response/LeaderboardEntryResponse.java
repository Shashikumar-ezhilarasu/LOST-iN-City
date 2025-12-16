package com.lostcity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryResponse {
    private String userId;
    private String displayName;
    private String avatarUrl;
    private Integer score;
    private Integer rank;
    private Integer foundReportsCount;
    private Integer lostReportsCount;
    private Integer questsCompletedCount;
}
