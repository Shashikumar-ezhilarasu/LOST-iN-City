package com.lostcity.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;

@Document(collection = "match_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchRequest {

    @Id
    private String id;

    private String lostReportId;

    private String foundReportId;

    @DBRef
    private User initiatedBy;

    @Builder.Default
    private MatchStatus status = MatchStatus.PENDING;

    @CreatedDate
    private OffsetDateTime createdAt;

    @LastModifiedDate
    private OffsetDateTime updatedAt;

    public enum MatchStatus {
        PENDING, ACCEPTED, REJECTED, CANCELLED
    }
}
