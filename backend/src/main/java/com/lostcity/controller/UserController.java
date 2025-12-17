package com.lostcity.controller;

import com.lostcity.dto.response.ApiResponse;
import com.lostcity.dto.response.UserResponse;
import com.lostcity.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse response = userService.getCurrentUserResponse();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        UserResponse response = userService.getCurrentUserResponse();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody Map<String, String> updates) {
        String displayName = updates.get("displayName");
        if (displayName != null && !displayName.trim().isEmpty()) {
            UserResponse response = userService.updateDisplayName(displayName.trim());
            return ResponseEntity.ok(ApiResponse.success(response));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Display name cannot be empty"));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(@RequestBody Map<String, String> updates) {
        UserResponse response = userService.updateCurrentUser(
                updates.get("display_name"),
                updates.get("avatar_url"),
                updates.get("bio"),
                updates.get("phone"));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
