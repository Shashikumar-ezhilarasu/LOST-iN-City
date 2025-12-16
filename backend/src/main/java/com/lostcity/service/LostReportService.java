package com.lostcity.service;

import com.lostcity.dto.request.CreateLostReportRequest;
import com.lostcity.dto.response.LostReportResponse;
import com.lostcity.model.LostReport;
import com.lostcity.model.User;
import com.lostcity.repository.LostReportRepository;
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
public class LostReportService {

    private final LostReportRepository lostReportRepository;
    private final UserService userService;

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
    public LostReportResponse getLostReportById(UUID id) {
        LostReport report = lostReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost report not found"));
        return mapToResponse(report);
    }

    @Transactional(readOnly = true)
    public Page<LostReportResponse> searchLostReports(
            String query,
            String category,
            String status,
            int page,
            int pageSize,
            String sort) {
        Pageable pageable = createPageable(page, pageSize, sort);
        Specification<LostReport> spec = createSpecification(query, category, status);

        return lostReportRepository.findAll(spec, pageable)
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

    private Specification<LostReport> createSpecification(String query, String category, String status) {
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
                predicates.add(cb.equal(root.get("status"), LostReport.ItemStatus.valueOf(status.toUpperCase())));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
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
                .status(report.getStatus().name().toLowerCase())
                .lostAt(report.getLostAt())
                .reportedBy(LostReportResponse.UserSummary.builder()
                        .id(report.getReportedBy().getId())
                        .displayName(report.getReportedBy().getDisplayName())
                        .avatarUrl(report.getReportedBy().getAvatarUrl())
                        .build())
                .visibility(report.getVisibility().name().toLowerCase())
                .matchedFoundItemId(report.getMatchedFoundItemId())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }

    private LostReportResponse mapToSummaryResponse(LostReport report) {
        return LostReportResponse.builder()
                .id(report.getId())
                .title(report.getTitle())
                .category(report.getCategory())
                .locationName(report.getLocationName())
                .lostAt(report.getLostAt())
                .status(report.getStatus().name().toLowerCase())
                .tags(report.getTags())
                .rewardAmount(report.getRewardAmount())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
