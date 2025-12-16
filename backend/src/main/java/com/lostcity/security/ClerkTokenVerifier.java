package com.lostcity.security;

import com.lostcity.model.User;
import com.lostcity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ClerkTokenVerifier {

    @Value("${clerk.secret-key:}")
    private String clerkSecretKey;

    private final UserRepository userRepository;

    /**
     * Verify Clerk JWT token and extract user information
     * For production, you should verify with Clerk's JWKS endpoint
     * This is a simplified version for development
     */
    public Optional<User> verifyAndGetUser(String token) {
        try {
            if (clerkSecretKey == null || clerkSecretKey.isEmpty()) {
                throw new RuntimeException("Clerk secret key not configured");
            }

            // In production, fetch and use Clerk's JWKS for verification
            // For now, we'll extract the claims and trust the token if signed correctly

            // Parse without verification for development (INSECURE - see note below)
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return Optional.empty();
            }

            // Decode payload (this is NOT secure, just for extracting clerk_id)
            java.util.Base64.Decoder decoder = java.util.Base64.getUrlDecoder();
            String payload = new String(decoder.decode(parts[1]));

            // Extract sub (clerk user ID) from payload
            // In production: Use proper JWT library with Clerk's public key verification
            String clerkId = extractClerkIdFromPayload(payload);

            if (clerkId == null) {
                return Optional.empty();
            }

            // Find or create user based on Clerk ID
            return userRepository.findByClerkId(clerkId);

        } catch (Exception e) {
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
