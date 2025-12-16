package com.lostcity.repository;

import com.lostcity.model.FoundReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FoundReportRepository extends JpaRepository<FoundReport, UUID>,
        JpaSpecificationExecutor<FoundReport> {

    Page<FoundReport> findByReportedById(UUID userId, Pageable pageable);

    @Query("SELECT fr FROM FoundReport fr WHERE " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(fr.latitude)) * " +
            "cos(radians(fr.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(fr.latitude)))) <= :radiusKm " +
            "ORDER BY fr.createdAt DESC")
    List<FoundReport> findNearbyItems(
            @Param("lat") Double latitude,
            @Param("lng") Double longitude,
            @Param("radiusKm") Double radiusKm);
}
