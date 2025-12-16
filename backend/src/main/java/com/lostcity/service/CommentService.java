package com.lostcity.service;

import com.lostcity.dto.request.CreateCommentRequest;
import com.lostcity.dto.response.CommentResponse;
import com.lostcity.model.Comment;
import com.lostcity.model.User;
import com.lostcity.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserService userService;

    @Transactional
    public CommentResponse createComment(Comment.ItemType itemType, UUID itemId, CreateCommentRequest request) {
        User currentUser = userService.getCurrentUser();

        Comment comment = Comment.builder()
                .itemType(itemType)
                .itemId(itemId)
                .author(currentUser)
                .content(request.getContent())
                .build();

        comment = commentRepository.save(comment);
        return mapToResponse(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByItem(Comment.ItemType itemType, UUID itemId) {
        return commentRepository.findByItemTypeAndItemIdOrderByCreatedAtAsc(itemType, itemId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .author(CommentResponse.UserSummary.builder()
                        .id(comment.getAuthor().getId())
                        .displayName(comment.getAuthor().getDisplayName())
                        .avatarUrl(comment.getAuthor().getAvatarUrl())
                        .build())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
