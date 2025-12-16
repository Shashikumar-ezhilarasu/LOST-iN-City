package com.lostcity.repository;

import com.lostcity.model.Quest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;

@Repository
public interface QuestRepository extends MongoRepository<Quest, String> {

    @Query("{ $or: [ { 'expiresAt': null }, { 'expiresAt': { $gt: ?0 } } ] }")
    Page<Quest> findActiveQuests(OffsetDateTime now, Pageable pageable);
}
