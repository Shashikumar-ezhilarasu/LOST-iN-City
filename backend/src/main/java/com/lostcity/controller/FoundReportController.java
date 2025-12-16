package com.lostcity.controller;

import com.lostcity.dto.request.CreateFoundReportRequest;
import com.lostcity.dto.request.CreateCommentRequest;
import com.lostcity.dto.response.ApiResponse;
import com.lostcity.dto.response.CommentResponse;
import com.lostcity.dto.response.FoundReportResponse;
import com.lostcity.model.Comment;
import com.lostcity.service.CommentService;
import com.lostcity.service.FoundReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/found-reports")
@RequiredArgsConstructor
public class FoundReportController {

    private final FoundReportService foundReportService;
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<FoundReportResponse>> createFoundReport(
            @Valid @RequestBody CreateFoundReportRequest request) {
        FoundReportResponse response = foundReportService.createFoundReport(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoundReportResponse>> getFoundReport(@PathVariable String id) {
        FoundReportResponse response = foundReportService.getFoundReportById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoundReportResponse>>> searchFoundReports(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) String sort) {
        Page<FoundReportResponse> responsePage = foundReportService.searchFoundReports(q, category, status, page,
                pageSize, sort);

        ApiResponse.MetaData meta = ApiResponse.MetaData.builder()
                .page(page)
                .pageSize(pageSize)
                .total(responsePage.getTotalElements())
                .build();

        return ResponseEntity.ok(ApiResponse.success(responsePage.getContent(), meta));
    }

    @GetMapping("/my-reports")
    public ResponseEntity<ApiResponse<List<FoundReportResponse>>> getMyFoundReports() {
        List<FoundReportResponse> reports = foundReportService.getMyFoundReports();
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable String id,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.createComment(Comment.ItemType.FOUND, id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable String id) {
        List<CommentResponse> comments = commentService.getCommentsByItem(Comment.ItemType.FOUND, id);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }
}
