package com.lostcity.repository;

import com.lostcity.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    List<Comment> findByItemTypeAndItemIdOrderByCreatedAtAsc(
            Comment.ItemType itemType,
            UUID itemId);

    Page<Comment> findByItemTypeAndItemId(
            Comment.ItemType itemType,
            UUID itemId,
            Pageable pageable);
}
