package com.lostcity.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;

@Document(collection = "user_quests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserQuest {

    @Id
    private String id;

    @DBRef
    private User user;

    @DBRef
    private Quest quest;

    @Builder.Default
    private QuestStatus status = QuestStatus.IN_PROGRESS;

    @CreatedDate
    private OffsetDateTime createdAt;

    @LastModifiedDate
    private OffsetDateTime updatedAt;

    public enum QuestStatus {
        IN_PROGRESS, COMPLETED
    }
}
