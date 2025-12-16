package com.lostcity.repository;

import com.lostcity.model.MatchRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRequestRepository extends MongoRepository<MatchRequest, String> {

    List<MatchRequest> findByLostReportId(String lostReportId);

    List<MatchRequest> findByFoundReportId(String foundReportId);

    Optional<MatchRequest> findByLostReportIdAndFoundReportId(String lostReportId, String foundReportId);
}
