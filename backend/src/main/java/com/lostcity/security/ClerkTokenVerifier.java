package com.lostcity.security;

import com.lostcity.model.User;
import com.lostcity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ClerkTokenVerifier {

    private static final Logger logger = LoggerFactory.getLogger(ClerkTokenVerifier.class);

    @Value("${clerk.publishable-key:}")
    private String clerkPublishableKey;

    private final UserRepository userRepository;

    /**
     * Verify Clerk JWT token and extract user information
     * NOTE: This is a simplified implementation for development.
     * In production, verify the JWT signature using Clerk's JWKS endpoint:
     * https://[your-clerk-domain]/.well-known/jwks.json
     */
    public Optional<User> verifyAndGetUser(String token) {
        try {
            logger.info("Verifying Clerk token...");

            // Parse JWT and extract payload
            // In production, you should verify the signature using Clerk's JWKS
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                logger.warn("Invalid JWT format - expected 3 parts, got: " + parts.length);
                return Optional.empty();
            }

            // Decode the JWT payload
            java.util.Base64.Decoder decoder = java.util.Base64.getUrlDecoder();
            String payload = new String(decoder.decode(parts[1]));

            // Log the payload for debugging (remove in production)
            logger.info("JWT Payload: " + payload);

            // Extract user information from payload
            String clerkId = extractClerkIdFromPayload(payload);
            String email = extractEmailFromPayload(payload);

            logger.info("Extracted from token - clerkId: " + clerkId + ", email: " + email);

            if (clerkId == null) {
                logger.warn("Could not extract clerkId from token payload");
                return Optional.empty();
            }

            // Find or create user based on Clerk ID
            Optional<User> existingUser = userRepository.findByClerkId(clerkId);

            if (existingUser.isPresent()) {
                logger.info("Found existing user: " + existingUser.get().getEmail());
                return existingUser;
            } else {
                // Auto-create user on first login
                // If email is null, use clerkId as email for now
                String userEmail = (email != null) ? email : (clerkId + "@clerk.user");
                logger.info("Creating new user for clerkId: " + clerkId + ", email: " + userEmail);
                String displayName = (email != null) ? email.split("@")[0] : clerkId;
                User newUser = User.builder()
                        .clerkId(clerkId)
                        .email(userEmail)
                        .displayName(displayName)
                        .role(User.Role.USER)
                        .build();
                User savedUser = userRepository.save(newUser);
                logger.info("Successfully created new user with id: " + savedUser.getId());
                return Optional.of(savedUser);
            }

            // This code is now unreachable but kept for safety
            // logger.warn("Could not find or create user - email was null");
            // return Optional.empty();

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid token format: " + e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            logger.error("Error verifying Clerk token: " + e.getMessage());
            return Optional.empty();
        }
    }

    private String extractClerkIdFromPayload(String payload) {
        try {
            // Simple JSON parsing - in production use proper JSON library
            if (payload.contains("\"sub\":\"")) {
                int start = payload.indexOf("\"sub\":\"") + 7;
                int end = payload.indexOf("\"", start);
                return payload.substring(start, end);
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    private String extractEmailFromPayload(String payload) {
        try {
            // Extract email from JWT payload
            if (payload.contains("\"email\":\"")) {
                int start = payload.indexOf("\"email\":\"") + 9;
                int end = payload.indexOf("\"", start);
                return payload.substring(start, end);
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    /**
     * Create or update user from Clerk webhook data
     */
    public User syncUserFromClerk(String clerkId, String email, String displayName, String avatarUrl) {
        Optional<User> existingUser = userRepository.findByClerkId(clerkId);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update user info
            if (email != null)
                user.setEmail(email);
            if (displayName != null)
                user.setDisplayName(displayName);
            if (avatarUrl != null)
                user.setAvatarUrl(avatarUrl);
        } else {
            // Create new user
            user = User.builder()
                    .clerkId(clerkId)
                    .email(email)
                    .displayName(displayName)
                    .avatarUrl(avatarUrl)
                    .role(User.Role.USER)
                    .build();
        }

        return userRepository.save(user);
    }
}
