package com.lostcity.controller;

import com.lostcity.dto.response.ApiResponse;
import com.lostcity.dto.response.LeaderboardEntryResponse;
import com.lostcity.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaderboardEntryResponse>>> getLeaderboard(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<LeaderboardEntryResponse> responsePage = leaderboardService.getLeaderboard(page, pageSize);

        ApiResponse.MetaData meta = ApiResponse.MetaData.builder()
                .page(page)
                .pageSize(pageSize)
                .total(responsePage.getTotalElements())
                .build();

        return ResponseEntity.ok(ApiResponse.success(responsePage.getContent(), meta));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<LeaderboardEntryResponse>> getCurrentUserRank() {
        LeaderboardEntryResponse response = leaderboardService.getCurrentUserRank();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
