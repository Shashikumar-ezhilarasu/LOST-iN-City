package com.lostcity.repository;

import com.lostcity.model.Claim;
import com.lostcity.model.LostReport;
import com.lostcity.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends MongoRepository<Claim, String> {

    List<Claim> findByLostReportOrderByCreatedAtDesc(LostReport lostReport);

    List<Claim> findByOwnerOrderByCreatedAtDesc(User owner);

    List<Claim> findByClaimerOrderByCreatedAtDesc(User claimer);

    List<Claim> findByStatusOrderByCreatedAtDesc(Claim.ClaimStatus status);

    Optional<Claim> findByIdAndOwner(String id, User owner);

    List<Claim> findByLostReportAndStatus(LostReport lostReport, Claim.ClaimStatus status);
}
