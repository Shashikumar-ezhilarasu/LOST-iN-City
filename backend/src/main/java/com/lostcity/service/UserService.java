package com.lostcity.service;

import com.lostcity.dto.response.UserResponse;
import com.lostcity.model.User;
import com.lostcity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found with email: " + email + ". Please login again."));
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUserResponse() {
        User user = getCurrentUser();
        return mapToResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateCurrentUser(String displayName, String avatarUrl, String bio, String phone) {
        User user = getCurrentUser();

        if (displayName != null)
            user.setDisplayName(displayName);
        if (avatarUrl != null)
            user.setAvatarUrl(avatarUrl);
        if (bio != null)
            user.setBio(bio);
        if (phone != null)
            user.setPhone(phone);

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateDisplayName(String displayName) {
        User user = getCurrentUser();
        user.setDisplayName(displayName);
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public void incrementFoundReportsCount(User user) {
        user.setFoundReportsCount(user.getFoundReportsCount() + 1);
        updateScore(user);
        userRepository.save(user);
    }

    @Transactional
    public void incrementLostReportsCount(User user) {
        user.setLostReportsCount(user.getLostReportsCount() + 1);
        updateScore(user);
        userRepository.save(user);
    }

    @Transactional
    public void incrementQuestsCompletedCount(User user) {
        user.setQuestsCompletedCount(user.getQuestsCompletedCount() + 1);
        updateScore(user);
        userRepository.save(user);
    }

    private void updateScore(User user) {
        int score = (user.getFoundReportsCount() * 10) +
                (user.getLostReportsCount() * 5) +
                (user.getQuestsCompletedCount() * 20);
        user.setScore(score);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .phone(user.getPhone())
                .role(user.getRole().name().toLowerCase())
                .score(user.getScore())
                .coins(user.getCoins())
                .lifetimeEarnings(user.getLifetimeEarnings())
                .lifetimeSpent(user.getLifetimeSpent())
                .badges(user.getBadges())
                .skills(user.getSkills())
                .foundReportsCount(user.getFoundReportsCount())
                .lostReportsCount(user.getLostReportsCount())
                .itemsReturnedCount(user.getItemsReturnedCount())
                .questsCompletedCount(user.getQuestsCompletedCount())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
