package com.lostcity.repository;

import com.lostcity.model.LostReport;
import com.lostcity.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostReportRepository extends MongoRepository<LostReport, String> {

    Page<LostReport> findByReportedById(String userId, Pageable pageable);

    List<LostReport> findByReportedByOrderByCreatedAtDesc(User user);

    @Query("{ $and: [ { 'latitude': { $ne: null } }, { 'longitude': { $ne: null } } ] }")
    List<LostReport> findAllWithLocation();
}
