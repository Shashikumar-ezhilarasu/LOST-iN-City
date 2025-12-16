package com.lostcity.repository;

import com.lostcity.model.FoundReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoundReportRepository extends MongoRepository<FoundReport, String> {

    Page<FoundReport> findByReportedById(String userId, Pageable pageable);

    @Query("{ $and: [ { 'latitude': { $ne: null } }, { 'longitude': { $ne: null } } ] }")
    List<FoundReport> findAllWithLocation();
}
