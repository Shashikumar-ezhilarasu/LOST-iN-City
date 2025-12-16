package com.lostcity.service;

import com.lostcity.dto.request.CreateFoundReportRequest;
import com.lostcity.dto.response.FoundReportResponse;
import com.lostcity.model.FoundReport;
import com.lostcity.model.User;
import com.lostcity.repository.FoundReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FoundReportService {

    private final FoundReportRepository foundReportRepository;
    private final UserService userService;

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
    public FoundReportResponse getFoundReportById(UUID id) {
        FoundReport report = foundReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Found report not found"));
        return mapToResponse(report);
    }

    @Transactional(readOnly = true)
    public Page<FoundReportResponse> searchFoundReports(
            String query,
            String category,
            String status,
            int page,
            int pageSize,
            String sort) {
        Pageable pageable = createPageable(page, pageSize, sort);
        Specification<FoundReport> spec = createSpecification(query, category, status);

        return foundReportRepository.findAll(spec, pageable)
                .map(this::mapToSummaryResponse);
    }

    private Pageable createPageable(int page, int pageSize, String sort) {
        Sort sortObj = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sort != null && !sort.isEmpty()) {
            String[] parts = sort.split(":");
            Sort.Direction direction = parts.length > 1 && parts[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC
                    : Sort.Direction.DESC;
            sortObj = Sort.by(direction, parts[0]);
        }
        return PageRequest.of(page - 1, pageSize, sortObj);
    }

    private Specification<FoundReport> createSpecification(String query, String category, String status) {
        return (root, criteriaQuery, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

            if (query != null && !query.isEmpty()) {
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), "%" + query.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + query.toLowerCase() + "%")));
            }

            if (category != null && !category.isEmpty()) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), FoundReport.ItemStatus.valueOf(status.toUpperCase())));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
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
