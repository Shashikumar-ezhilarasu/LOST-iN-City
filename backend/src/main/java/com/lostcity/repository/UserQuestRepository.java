package com.lostcity.repository;

import com.lostcity.model.UserQuest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserQuestRepository extends MongoRepository<UserQuest, String> {

    Optional<UserQuest> findByUserIdAndQuestId(String userId, String questId);

    boolean existsByUserIdAndQuestId(String userId, String questId);

    Page<UserQuest> findByUserId(String userId, Pageable pageable);

    Page<UserQuest> findByUserIdAndStatus(String userId, UserQuest.QuestStatus status, Pageable pageable);

    @Query(value = "{ 'user.$id': ?0, 'status': ?1 }", count = true)
    Long countByUserIdAndStatus(String userId, UserQuest.QuestStatus status);
}
