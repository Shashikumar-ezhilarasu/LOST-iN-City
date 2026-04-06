package com.lostcity.controller;

import com.lostcity.dto.response.ApiResponse;
import com.lostcity.kafka.producer.KafkaProducerService;
import com.lostcity.model.Claim;
import com.lostcity.service.ClaimService;
import com.lostcity.service.RewardCalculationService;
import com.lostcity.repository.LostReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;
    private final RewardCalculationService rewardCalculationService;
    private final LostReportRepository lostReportRepository;
    private final KafkaProducerService kafkaProducerService;

    @PostMapping
    public ResponseEntity<ApiResponse<Claim>> createClaim(@RequestBody Map<String, String> request) {
        String lostReportId = request.get("lost_report_id");
        String foundReportId = request.get("found_report_id");
        String message = request.get("message");

        if (lostReportId == null) {
            throw new RuntimeException("lost_report_id is required");
        }

        Claim claim = claimService.createClaim(lostReportId, foundReportId, message);

        // Publish claim-submitted event — notifies the owner and downstream services
        kafkaProducerService.publishClaimSubmitted(
                claim.getId(),
                claim.getClaimer() != null ? claim.getClaimer().getId() : "unknown",
                lostReportId,
                foundReportId,
                claim.getOwner() != null ? claim.getOwner().getId() : "unknown",
                claim.getRewardAmount(),
                message);

        return ResponseEntity.ok(ApiResponse.success(claim));
    }

    @GetMapping("/lost-report/{lostReportId}")
    public ResponseEntity<ApiResponse<List<Claim>>> getClaimsForLostReport(@PathVariable String lostReportId) {
        List<Claim> claims = claimService.getClaimsForLostReport(lostReportId);
        return ResponseEntity.ok(ApiResponse.success(claims));
    }

    @GetMapping("/my-claims")
    public ResponseEntity<ApiResponse<List<Claim>>> getMyClaims() {
        List<Claim> claims = claimService.getMyClaims();
        return ResponseEntity.ok(ApiResponse.success(claims));
    }

    @GetMapping("/my-lost-items")
    public ResponseEntity<ApiResponse<List<Claim>>> getClaimsForMyLostItems() {
        List<Claim> claims = claimService.getClaimsForMyLostItems();
        return ResponseEntity.ok(ApiResponse.success(claims));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Claim>> getClaimById(@PathVariable String id) {
        Claim claim = claimService.getClaimById(id);
        return ResponseEntity.ok(ApiResponse.success(claim));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<Claim>> approveClaim(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        String response = request.get("response");
        Claim claim = claimService.approveClaim(id, response);

        // Publish claim-approved event — notifies the finder
        kafkaProducerService.publishClaimApproved(
                claim.getId(),
                claim.getOwner() != null ? claim.getOwner().getId() : "unknown",
                claim.getLostReport() != null ? claim.getLostReport().getId() : "unknown",
                claim.getClaimer() != null ? claim.getClaimer().getId() : "unknown",
                claim.getRewardAmount(),
                response);

        return ResponseEntity.ok(ApiResponse.success(claim));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<Claim>> rejectClaim(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        String response = request.get("response");
        Claim claim = claimService.rejectClaim(id, response);
        return ResponseEntity.ok(ApiResponse.success(claim));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Claim>> completeClaimAndReleaseReward(@PathVariable String id) {
        Claim claim = claimService.completeClaimAndReleaseReward(id);
        return ResponseEntity.ok(ApiResponse.success(claim));
    }

    /**
     * Get reward calculation breakdown for a lost report
     * Shows how the reward is calculated dynamically
     */
    @GetMapping("/reward-breakdown/{lostReportId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRewardBreakdown(@PathVariable String lostReportId) {
        var lostReport = lostReportRepository.findById(lostReportId)
                .orElseThrow(() -> new RuntimeException("Lost report not found"));

        Map<String, Object> breakdown = rewardCalculationService.getRewardBreakdown(lostReport);
        return ResponseEntity.ok(ApiResponse.success(breakdown));
    }
}
