package com.lostcity.repository;

import com.lostcity.model.Quest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.UUID;

@Repository
public interface QuestRepository extends JpaRepository<Quest, UUID> {

    @Query("SELECT q FROM Quest q WHERE q.expiresAt IS NULL OR q.expiresAt > :now")
    Page<Quest> findActiveQuests(OffsetDateTime now, Pageable pageable);
}
