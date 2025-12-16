package com.lostcity.controller;

import com.lostcity.dto.response.ApiResponse;
import com.lostcity.security.ClerkTokenVerifier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final ClerkTokenVerifier clerkTokenVerifier;

    /**
     * Clerk webhook endpoint to sync user data
     * Configure this webhook in Clerk Dashboard: user.created and user.updated
     * events
     */
    @SuppressWarnings("unchecked")
    @PostMapping("/clerk")
    public ResponseEntity<ApiResponse<String>> handleClerkWebhook(@RequestBody Map<String, Object> payload) {
        try {
            String type = (String) payload.get("type");

            if ("user.created".equals(type) || "user.updated".equals(type)) {
                Map<String, Object> data = (Map<String, Object>) payload.get("data");

                String clerkId = (String) data.get("id");

                // Extract email from email_addresses array
                String email = null;
                Object emailAddresses = data.get("email_addresses");
                if (emailAddresses instanceof java.util.List) {
                    java.util.List<Map<String, Object>> emails = (java.util.List<Map<String, Object>>) emailAddresses;
                    if (!emails.isEmpty()) {
                        email = (String) emails.get(0).get("email_address");
                    }
                }

                String firstName = (String) data.get("first_name");
                String lastName = (String) data.get("last_name");
                String displayName = (firstName != null ? firstName : "") +
                        (lastName != null ? " " + lastName : "");
                displayName = displayName.trim();
                if (displayName.isEmpty()) {
                    displayName = email != null ? email.split("@")[0] : "User";
                }

                String avatarUrl = (String) data.get("image_url");

                // Sync user to database
                clerkTokenVerifier.syncUserFromClerk(clerkId, email, displayName, avatarUrl);

                return ResponseEntity.ok(ApiResponse.success("User synced successfully"));
            }

            return ResponseEntity.ok(ApiResponse.success("Event ignored"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(java.util.List.of(
                            ApiResponse.ErrorDetail.builder()
                                    .code("WEBHOOK_ERROR")
                                    .message("Failed to process webhook: " + e.getMessage())
                                    .build())));
        }
    }
}
