package com.lostcity.repository;

import com.lostcity.model.Transaction;
import com.lostcity.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {

    List<Transaction> findByToUserOrderByCreatedAtDesc(User user);

    List<Transaction> findByFromUserOrderByCreatedAtDesc(User user);

    List<Transaction> findByRelatedClaimId(String claimId);
}
