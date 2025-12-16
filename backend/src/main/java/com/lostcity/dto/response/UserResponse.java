package com.lostcity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String email;
    private String displayName;
    private String avatarUrl;
    private String bio;
    private String phone;
    private String role;
    private Integer score;
    private Integer foundReportsCount;
    private Integer lostReportsCount;
    private Integer questsCompletedCount;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
