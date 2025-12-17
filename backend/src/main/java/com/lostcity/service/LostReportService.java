package com.lostcity.service;

import com.lostcity.dto.request.CreateLostReportRequest;
import com.lostcity.dto.response.LostReportResponse;
import com.lostcity.model.LostReport;
import com.lostcity.model.User;
import com.lostcity.repository.LostReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LostReportService {

    private final LostReportRepository lostReportRepository;
    private final UserService userService;
    private final MongoTemplate mongoTemplate;

    @Transactional
    public LostReportResponse createLostReport(CreateLostReportRequest request) {
        User currentUser = userService.getCurrentUser();

        LostReport report = LostReport.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .images(request.getImages())
                .tags(request.getTags())
                .color(request.getColor())
                .brand(request.getBrand())
                .rewardAmount(request.getRewardAmount())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .locationName(request.getLocationName())
                .lostAt(request.getLostAt())
                .reportedBy(currentUser)
                .visibility(request.getVisibility() != null
                        ? LostReport.Visibility.valueOf(request.getVisibility().toUpperCase())
                        : LostReport.Visibility.PUBLIC)
                .build();

        report = lostReportRepository.save(report);
        userService.incrementLostReportsCount(currentUser);

        return mapToResponse(report);
    }

    @Transactional(readOnly = true)
    public LostReportResponse getLostReportById(String id) {
        LostReport report = lostReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost report not found"));
        return mapToResponse(report);
    }

    @Transactional(readOnly = true)
    public Page<LostReportResponse> searchLostReports(
            String queryText,
            String category,
            String status,
            int page,
            int pageSize,
            String sort) {
        // Ensure page is at least 1
        page = Math.max(1, page);

        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (queryText != null && !queryText.isEmpty()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("title").regex(queryText, "i"),
                    Criteria.where("description").regex(queryText, "i")));
        }

        if (category != null && !category.isEmpty()) {
            criteriaList.add(Criteria.where("category").is(category));
        }

        if (status != null && !status.isEmpty()) {
            criteriaList.add(Criteria.where("status").is(status.toUpperCase()));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        // Sort
        Sort sortObj = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sort != null && !sort.isEmpty()) {
            String[] parts = sort.split(":");
            Sort.Direction direction = parts.length > 1 && parts[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC
                    : Sort.Direction.DESC;
            sortObj = Sort.by(direction, parts[0]);
        }
        query.with(sortObj);

        // Pagination
        long total = mongoTemplate.count(query, LostReport.class);
        query.with(PageRequest.of(page - 1, pageSize));

        List<LostReport> reports = mongoTemplate.find(query, LostReport.class);
        List<LostReportResponse> responses = reports.stream()
                .map(this::mapToSummaryResponse)
                .toList();

        return new PageImpl<>(responses, PageRequest.of(page - 1, pageSize, sortObj), total);
    }

    @Transactional(readOnly = true)
    public List<LostReportResponse> getMyLostReports() {
        User currentUser = userService.getCurrentUser();
        List<LostReport> reports = lostReportRepository.findByReportedByOrderByCreatedAtDesc(currentUser);
        return reports.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private LostReportResponse mapToResponse(LostReport report) {
        return LostReportResponse.builder()
                .id(report.getId())
                .title(report.getTitle())
                .description(report.getDescription())
                .category(report.getCategory())
                .images(report.getImages())
                .tags(report.getTags())
                .color(report.getColor())
                .brand(report.getBrand())
                .rewardAmount(report.getRewardAmount())
                .latitude(report.getLatitude())
                .longitude(report.getLongitude())
                .locationName(report.getLocationName())
                .status(report.getStatus().name())
                .lostAt(report.getLostAt())
                .reportedBy(LostReportResponse.UserSummary.builder()
                        .id(report.getReportedBy().getId())
                        .displayName(report.getReportedBy().getDisplayName())
                        .avatarUrl(report.getReportedBy().getAvatarUrl())
                        .build())
                .visibility(report.getVisibility().name().toLowerCase())
                .matchedFoundItemId(report.getMatchedFoundItemId())
                .approvedClaimId(report.getApprovedClaimId())
                .rewardReleased(report.getRewardReleased())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }

    private LostReportResponse mapToSummaryResponse(LostReport report) {
        return LostReportResponse.builder()
                .id(report.getId())
                .title(report.getTitle())
                .description(report.getDescription())
                .category(report.getCategory())
                .images(report.getImages())
                .tags(report.getTags())
                .color(report.getColor())
                .brand(report.getBrand())
                .locationName(report.getLocationName())
                .lostAt(report.getLostAt())
                .status(report.getStatus().name().toLowerCase())
                .rewardAmount(report.getRewardAmount())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
