package com.lostcity.repository;

import com.lostcity.model.UserQuest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserQuestRepository extends JpaRepository<UserQuest, UUID> {

    Optional<UserQuest> findByUserIdAndQuestId(UUID userId, UUID questId);

    boolean existsByUserIdAndQuestId(UUID userId, UUID questId);

    Page<UserQuest> findByUserId(UUID userId, Pageable pageable);

    Page<UserQuest> findByUserIdAndStatus(UUID userId, UserQuest.QuestStatus status, Pageable pageable);

    @Query("SELECT COUNT(uq) FROM UserQuest uq WHERE uq.user.id = :userId AND uq.status = :status")
    Long countByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") UserQuest.QuestStatus status);
}
