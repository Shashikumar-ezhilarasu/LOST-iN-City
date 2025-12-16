package com.lostcity.controller;

import com.lostcity.dto.request.CreateLostReportRequest;
import com.lostcity.dto.request.CreateCommentRequest;
import com.lostcity.dto.response.ApiResponse;
import com.lostcity.dto.response.CommentResponse;
import com.lostcity.dto.response.LostReportResponse;
import com.lostcity.model.Comment;
import com.lostcity.service.CommentService;
import com.lostcity.service.LostReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lost-reports")
@RequiredArgsConstructor
public class LostReportController {

    private final LostReportService lostReportService;
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<LostReportResponse>> createLostReport(
            @Valid @RequestBody CreateLostReportRequest request) {
        LostReportResponse response = lostReportService.createLostReport(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LostReportResponse>> getLostReport(@PathVariable String id) {
        LostReportResponse response = lostReportService.getLostReportById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LostReportResponse>>> searchLostReports(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) String sort) {
        Page<LostReportResponse> responsePage = lostReportService.searchLostReports(q, category, status, page, pageSize,
                sort);

        ApiResponse.MetaData meta = ApiResponse.MetaData.builder()
                .page(page)
                .pageSize(pageSize)
                .total(responsePage.getTotalElements())
                .build();

        return ResponseEntity.ok(ApiResponse.success(responsePage.getContent(), meta));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable String id,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.createComment(Comment.ItemType.LOST, id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable String id) {
        List<CommentResponse> comments = commentService.getCommentsByItem(Comment.ItemType.LOST, id);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }
}
