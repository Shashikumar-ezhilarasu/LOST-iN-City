package com.lostcity.service;

import com.lostcity.model.*;
import com.lostcity.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final LostReportRepository lostReportRepository;
    private final FoundReportRepository foundReportRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final CurrencyService currencyService;

    @Transactional
    public Claim createClaim(String lostReportId, String foundReportId, String message) {
        User claimer = userService.getCurrentUser();

        LostReport lostReport = lostReportRepository.findById(lostReportId)
                .orElseThrow(() -> new RuntimeException("Lost report not found"));

        if (lostReport.getStatus() != LostReport.ItemStatus.OPEN) {
            throw new RuntimeException("This item is no longer open for claims");
        }

        if (lostReport.getReportedBy().getId().equals(claimer.getId())) {
            throw new RuntimeException("You cannot claim your own lost item");
        }

        FoundReport foundReport = null;
        if (foundReportId != null) {
            foundReport = foundReportRepository.findById(foundReportId)
                    .orElseThrow(() -> new RuntimeException("Found report not found"));

            if (!foundReport.getReportedBy().getId().equals(claimer.getId())) {
                throw new RuntimeException("You can only create claims with your own found reports");
            }
        }

        Claim claim = Claim.builder()
                .lostReport(lostReport)
                .foundReport(foundReport)
                .claimer(claimer)
                .owner(lostReport.getReportedBy())
                .claimerMessage(message)
                .rewardAmount(lostReport.getRewardAmount())
                .status(Claim.ClaimStatus.PENDING)
                .build();

        return claimRepository.save(claim);
    }

    @Transactional(readOnly = true)
    public List<Claim> getClaimsForLostReport(String lostReportId) {
        User currentUser = userService.getCurrentUser();

        LostReport lostReport = lostReportRepository.findById(lostReportId)
                .orElseThrow(() -> new RuntimeException("Lost report not found"));

        // Only the owner can see all claims for their lost report
        if (!lostReport.getReportedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only view claims for your own lost reports");
        }

        return claimRepository.findByLostReportOrderByCreatedAtDesc(lostReport);
    }

    @Transactional(readOnly = true)
    public List<Claim> getMyClaims() {
        User currentUser = userService.getCurrentUser();
        return claimRepository.findByClaimerOrderByCreatedAtDesc(currentUser);
    }

    @Transactional(readOnly = true)
    public List<Claim> getClaimsForMyLostItems() {
        User currentUser = userService.getCurrentUser();
        return claimRepository.findByOwnerOrderByCreatedAtDesc(currentUser);
    }

    @Transactional
    public Claim approveClaim(String claimId, String ownerResponse) {
        User currentUser = userService.getCurrentUser();

        Claim claim = claimRepository.findByIdAndOwner(claimId, currentUser)
                .orElseThrow(() -> new RuntimeException("Claim not found or you don't have permission"));

        if (claim.getStatus() != Claim.ClaimStatus.PENDING) {
            throw new RuntimeException("This claim has already been processed");
        }

        // Check if another claim was already approved for this lost report
        List<Claim> approvedClaims = claimRepository.findByLostReportAndStatus(
                claim.getLostReport(), Claim.ClaimStatus.APPROVED);

        if (!approvedClaims.isEmpty()) {
            throw new RuntimeException("Another claim has already been approved for this item");
        }

        claim.setStatus(Claim.ClaimStatus.APPROVED);
        claim.setOwnerResponse(ownerResponse);
        claim.setApprovedAt(OffsetDateTime.now());

        // Update lost report status
        LostReport lostReport = claim.getLostReport();
        lostReport.setStatus(LostReport.ItemStatus.MATCHED);
        lostReport.setApprovedClaimId(claimId);
        lostReportRepository.save(lostReport);

        // Update found report if exists
        if (claim.getFoundReport() != null) {
            FoundReport foundReport = claim.getFoundReport();
            foundReport.setStatus(FoundReport.ItemStatus.MATCHED);
            foundReport.setMatchedLostItemId(lostReport.getId());
            foundReportRepository.save(foundReport);
        }

        return claimRepository.save(claim);
    }

    @Transactional
    public Claim rejectClaim(String claimId, String ownerResponse) {
        User currentUser = userService.getCurrentUser();

        Claim claim = claimRepository.findByIdAndOwner(claimId, currentUser)
                .orElseThrow(() -> new RuntimeException("Claim not found or you don't have permission"));

        if (claim.getStatus() != Claim.ClaimStatus.PENDING) {
            throw new RuntimeException("This claim has already been processed");
        }

        claim.setStatus(Claim.ClaimStatus.REJECTED);
        claim.setOwnerResponse(ownerResponse);
        claim.setRejectedAt(OffsetDateTime.now());

        return claimRepository.save(claim);
    }

    @Transactional
    public Claim completeClaimAndReleaseReward(String claimId) {
        User currentUser = userService.getCurrentUser();

        Claim claim = claimRepository.findByIdAndOwner(claimId, currentUser)
                .orElseThrow(() -> new RuntimeException("Claim not found or you don't have permission"));

        if (claim.getStatus() != Claim.ClaimStatus.APPROVED) {
            throw new RuntimeException("Claim must be approved before releasing reward");
        }

        if (claim.getRewardPaid()) {
            throw new RuntimeException("Reward has already been paid for this claim");
        }

        LostReport lostReport = claim.getLostReport();
        if (lostReport.getRewardReleased()) {
            throw new RuntimeException("Reward has already been released for this lost report");
        }

        Double rewardAmount = claim.getRewardAmount();
        if (rewardAmount != null && rewardAmount > 0) {
            // Award coins using CurrencyService
            User claimer = claim.getClaimer();
            currencyService.awardItemReward(claimer, rewardAmount, lostReport.getId(), claimId);

            // Update items returned count
            claimer.setItemsReturnedCount(claimer.getItemsReturnedCount() + 1);
            userRepository.save(claimer);
        }

        // Update claim
        claim.setRewardPaid(true);
        claim.setStatus(Claim.ClaimStatus.COMPLETED);

        // Update lost report
        lostReport.setRewardReleased(true);
        lostReport.setStatus(LostReport.ItemStatus.CLOSED);
        lostReportRepository.save(lostReport);

        return claimRepository.save(claim);
    }

    @Transactional(readOnly = true)
    public Claim getClaimById(String claimId) {
        User currentUser = userService.getCurrentUser();

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        // Only owner or claimer can view the claim
        if (!claim.getOwner().getId().equals(currentUser.getId()) &&
                !claim.getClaimer().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to view this claim");
        }

        return claim;
    }
}
