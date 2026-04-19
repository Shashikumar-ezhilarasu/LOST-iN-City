package com.lostcity.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AIMatchResponse {
    private String lostReportId;
    private String lostReportTitle;
    private List<MatchDetail> matches;

    @Data
    @Builder
    public static class MatchDetail {
        private String foundReportId;
        private String foundReportTitle;
        private int matchScore; // 1-100
        private String reasoning;
        private String category;
        private String foundLocation;
        private String foundDescription;
    }
}
