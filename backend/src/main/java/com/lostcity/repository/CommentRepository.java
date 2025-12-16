package com.lostcity.repository;

import com.lostcity.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByItemTypeAndItemIdOrderByCreatedAtAsc(Comment.ItemType itemType, String itemId);

    Page<Comment> findByItemTypeAndItemId(Comment.ItemType itemType, String itemId, Pageable pageable);
}
