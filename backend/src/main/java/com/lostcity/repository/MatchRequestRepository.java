package com.lostcity.repository;

import com.lostcity.model.MatchRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchRequestRepository extends JpaRepository<MatchRequest, UUID> {

    List<MatchRequest> findByLostReportId(UUID lostReportId);

    List<MatchRequest> findByFoundReportId(UUID foundReportId);

    Optional<MatchRequest> findByLostReportIdAndFoundReportId(UUID lostReportId, UUID foundReportId);
}
