package com.lostcity.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String clerkId; // Clerk user ID for authentication

    @Indexed(unique = true)
    private String email;

    private String password; // Keep for backward compatibility, but won't be used with Clerk

    private String displayName;

    private String avatarUrl;

    private String bio;

    private String phone;

    @Builder.Default
    private Role role = Role.USER;

    @Builder.Default
    private Integer score = 0;

    @Builder.Default
    private Double coins = 0.0; // Virtual currency (LostCity Coins)

    @Builder.Default
    private Double lifetimeEarnings = 0.0; // Total coins ever earned

    @Builder.Default
    private Double lifetimeSpent = 0.0; // Total coins ever spent

    @Builder.Default
    private List<String> badges = new ArrayList<>(); // Achievement badges

    @Builder.Default
    private List<String> skills = new ArrayList<>(); // User skills/expertise

    @Builder.Default
    private Integer foundReportsCount = 0;

    @Builder.Default
    private Integer lostReportsCount = 0;

    @Builder.Default
    private Integer itemsReturnedCount = 0; // Count of items successfully returned

    @Builder.Default
    private Integer questsCompletedCount = 0;

    @CreatedDate
    private OffsetDateTime createdAt;

    @LastModifiedDate
    private OffsetDateTime updatedAt;

    public enum Role {
        USER, ADMIN
    }
}
