package com.lostcity.repository;

import com.lostcity.model.LostReport;
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
public interface LostReportRepository extends JpaRepository<LostReport, UUID>,
        JpaSpecificationExecutor<LostReport> {

    Page<LostReport> findByReportedById(UUID userId, Pageable pageable);

    @Query("SELECT lr FROM LostReport lr WHERE " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(lr.latitude)) * " +
            "cos(radians(lr.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(lr.latitude)))) <= :radiusKm " +
            "ORDER BY lr.createdAt DESC")
    List<LostReport> findNearbyItems(
            @Param("lat") Double latitude,
            @Param("lng") Double longitude,
            @Param("radiusKm") Double radiusKm);
}
