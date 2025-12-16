package com.lostcity.service;

import com.lostcity.dto.request.CreateFoundReportRequest;
import com.lostcity.dto.response.FoundReportResponse;
import com.lostcity.model.FoundReport;
import com.lostcity.model.User;
import com.lostcity.repository.FoundReportRepository;
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
public class FoundReportService {

    private final FoundReportRepository foundReportRepository;
    private final UserService userService;
    private final MongoTemplate mongoTemplate;

    @Transactional
    public FoundReportResponse createFoundReport(CreateFoundReportRequest request) {
        User currentUser = userService.getCurrentUser();

        FoundReport report = FoundReport.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .images(request.getImages())
                .tags(request.getTags())
                .color(request.getColor())
                .brand(request.getBrand())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .locationName(request.getLocationName())
                .foundAt(request.getFoundAt())
                .reportedBy(currentUser)
                .foundCondition(request.getFoundCondition() != null
                        ? FoundReport.Condition.valueOf(request.getFoundCondition().toUpperCase())
                        : null)
                .holdingInstructions(request.getHoldingInstructions())
                .build();

        report = foundReportRepository.save(report);
        userService.incrementFoundReportsCount(currentUser);

        return mapToResponse(report);
    }

    @Transactional(readOnly = true)
    public FoundReportResponse getFoundReportById(String id) {
        FoundReport report = foundReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Found report not found"));
        return mapToResponse(report);
    }

    @Transactional(readOnly = true)
    public Page<FoundReportResponse> searchFoundReports(
            String queryText,
            String category,
            String status,
            int page,
            int pageSize,
            String sort) {
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
        long total = mongoTemplate.count(query, FoundReport.class);
        query.with(PageRequest.of(page - 1, pageSize));

        List<FoundReport> reports = mongoTemplate.find(query, FoundReport.class);
        List<FoundReportResponse> responses = reports.stream()
                .map(this::mapToSummaryResponse)
                .toList();

        return new PageImpl<>(responses, PageRequest.of(page - 1, pageSize, sortObj), total);
    }

    private FoundReportResponse mapToResponse(FoundReport report) {
        return FoundReportResponse.builder()
                .id(report.getId())
                .title(report.getTitle())
                .description(report.getDescription())
                .category(report.getCategory())
                .images(report.getImages())
                .tags(report.getTags())
                .color(report.getColor())
                .brand(report.getBrand())
                .latitude(report.getLatitude())
                .longitude(report.getLongitude())
                .locationName(report.getLocationName())
                .status(report.getStatus().name().toLowerCase())
                .foundAt(report.getFoundAt())
                .reportedBy(FoundReportResponse.UserSummary.builder()
                        .id(report.getReportedBy().getId())
                        .displayName(report.getReportedBy().getDisplayName())
                        .avatarUrl(report.getReportedBy().getAvatarUrl())
                        .build())
                .foundCondition(
                        report.getFoundCondition() != null ? report.getFoundCondition().name().toLowerCase() : null)
                .holdingInstructions(report.getHoldingInstructions())
                .matchedLostItemId(report.getMatchedLostItemId())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }

    private FoundReportResponse mapToSummaryResponse(FoundReport report) {
        return FoundReportResponse.builder()
                .id(report.getId())
                .title(report.getTitle())
                .category(report.getCategory())
                .locationName(report.getLocationName())
                .foundAt(report.getFoundAt())
                .status(report.getStatus().name().toLowerCase())
                .tags(report.getTags())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
