package com.lostcity.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;

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
    private String email;

    private String password;

    private String displayName;

    private String avatarUrl;

    private String bio;

    private String phone;

    private Role role = Role.USER;

    private Integer score = 0;

    private Integer foundReportsCount = 0;

    private Integer lostReportsCount = 0;

    private Integer questsCompletedCount = 0;

    @CreatedDate
    private OffsetDateTime createdAt;

    @LastModifiedDate
    private OffsetDateTime updatedAt;

    public enum Role {
        USER, ADMIN
    }
}
