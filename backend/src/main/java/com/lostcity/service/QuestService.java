package com.lostcity.service;

import com.lostcity.dto.response.QuestResponse;
import com.lostcity.model.Quest;
import com.lostcity.model.User;
import com.lostcity.model.UserQuest;
import com.lostcity.repository.QuestRepository;
import com.lostcity.repository.UserQuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestService {

    private final QuestRepository questRepository;
    private final UserQuestRepository userQuestRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public Page<QuestResponse> getQuests(String statusFilter, int page, int pageSize) {
        // Ensure page is at least 1
        page = Math.max(1, page);

        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Quest> questsPage;
        if (statusFilter == null || statusFilter.equals("available") || statusFilter.equals("all")) {
            questsPage = questRepository.findActiveQuests(OffsetDateTime.now(), pageable);
        } else {
            questsPage = questRepository.findAll(pageable);
        }

        List<QuestResponse> questResponses = questsPage.getContent().stream()
                .map(quest -> {
                    UserQuest userQuest = userQuestRepository.findByUserIdAndQuestId(currentUser.getId(), quest.getId())
                            .orElse(null);

                    String status = userQuest != null ? userQuest.getStatus().name().toLowerCase() : "available";

                    if (statusFilter != null && !statusFilter.equals("all") && !status.equals(statusFilter)) {
                        return null;
                    }

                    return mapToResponse(quest, status);
                })
                .filter(q -> q != null)
                .collect(Collectors.toList());

        return new PageImpl<>(questResponses, pageable, questsPage.getTotalElements());
    }

    @Transactional
    public QuestResponse startQuest(String questId) {
        User currentUser = userService.getCurrentUser();
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Quest not found"));

        if (userQuestRepository.existsByUserIdAndQuestId(currentUser.getId(), questId)) {
            throw new RuntimeException("Quest already started");
        }

        UserQuest userQuest = UserQuest.builder()
                .user(currentUser)
                .quest(quest)
                .status(UserQuest.QuestStatus.IN_PROGRESS)
                .build();

        userQuestRepository.save(userQuest);
        return mapToResponse(quest, "in_progress");
    }

    @Transactional
    public QuestResponse completeQuest(String questId) {
        User currentUser = userService.getCurrentUser();
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Quest not found"));

        UserQuest userQuest = userQuestRepository.findByUserIdAndQuestId(currentUser.getId(), questId)
                .orElseThrow(() -> new RuntimeException("Quest not started"));

        if (userQuest.getStatus() == UserQuest.QuestStatus.COMPLETED) {
            throw new RuntimeException("Quest already completed");
        }

        userQuest.setStatus(UserQuest.QuestStatus.COMPLETED);
        userQuestRepository.save(userQuest);

        userService.incrementQuestsCompletedCount(currentUser);

        return mapToResponse(quest, "completed");
    }

    private QuestResponse mapToResponse(Quest quest, String status) {
        return QuestResponse.builder()
                .id(quest.getId())
                .title(quest.getTitle())
                .description(quest.getDescription())
                .difficulty(quest.getDifficulty().name().toLowerCase())
                .rewardPoints(quest.getRewardPoints())
                .expiresAt(quest.getExpiresAt())
                .status(status)
                .createdAt(quest.getCreatedAt())
                .updatedAt(quest.getUpdatedAt())
                .build();
    }
}
