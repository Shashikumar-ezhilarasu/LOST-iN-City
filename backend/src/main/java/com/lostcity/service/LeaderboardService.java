package com.lostcity.service;

import com.lostcity.dto.response.LeaderboardEntryResponse;
import com.lostcity.model.User;
import com.lostcity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public Page<LeaderboardEntryResponse> getLeaderboard(int page, int pageSize) {
        List<User> allUsers = userRepository.findAllOrderByScoreDesc();

        List<LeaderboardEntryResponse> entries = IntStream.range(0, allUsers.size())
                .mapToObj(i -> {
                    User user = allUsers.get(i);
                    return LeaderboardEntryResponse.builder()
                            .userId(user.getId())
                            .displayName(user.getDisplayName())
                            .avatarUrl(user.getAvatarUrl())
                            .score(user.getScore())
                            .rank(i + 1)
                            .foundReportsCount(user.getFoundReportsCount())
                            .lostReportsCount(user.getLostReportsCount())
                            .questsCompletedCount(user.getQuestsCompletedCount())
                            .build();
                })
                .collect(Collectors.toList());

        // Ensure page is at least 1
        page = Math.max(1, page);

        Pageable pageable = PageRequest.of(page - 1, pageSize);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), entries.size());

        return new PageImpl<>(entries.subList(start, end), pageable, entries.size());
    }

    @Transactional(readOnly = true)
    public LeaderboardEntryResponse getCurrentUserRank() {
        User currentUser = userService.getCurrentUser();
        List<User> allUsers = userRepository.findAllOrderByScoreDesc();

        for (int i = 0; i < allUsers.size(); i++) {
            if (allUsers.get(i).getId().equals(currentUser.getId())) {
                return LeaderboardEntryResponse.builder()
                        .userId(currentUser.getId())
                        .displayName(currentUser.getDisplayName())
                        .avatarUrl(currentUser.getAvatarUrl())
                        .score(currentUser.getScore())
                        .rank(i + 1)
                        .foundReportsCount(currentUser.getFoundReportsCount())
                        .lostReportsCount(currentUser.getLostReportsCount())
                        .questsCompletedCount(currentUser.getQuestsCompletedCount())
                        .build();
            }
        }

        return null;
    }
}
