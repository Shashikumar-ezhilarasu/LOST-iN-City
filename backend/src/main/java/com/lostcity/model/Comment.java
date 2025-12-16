package com.lostcity.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;

@Document(collection = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    private String id;

    private ItemType itemType;

    private String itemId;

    @DBRef
    private User author;

    private String content;

    @CreatedDate
    private OffsetDateTime createdAt;

    public enum ItemType {
        LOST, FOUND
    }
}
