package com.lostcity.service;

import com.lostcity.model.LostReport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Service to calculate dynamic rewards based on various factors
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RewardCalculationService {

    // Base reward amounts by category
    private static final Map<String, Double> CATEGORY_BASE_REWARDS = new HashMap<>() {
        {
            put("Electronics", 100.0);
            put("Jewelry", 150.0);
            put("Documents", 80.0);
            put("Wallet", 120.0);
            put("Keys", 50.0);
            put("Phone", 100.0);
            put("Laptop", 150.0);
            put("Bag", 70.0);
            put("Clothing", 40.0);
            put("Pet", 200.0);
            put("Vehicle", 300.0);
            put("Other", 50.0);
        }
    };

    /**
     * Calculate dynamic reward for finding and returning a lost item
     * 
     * @param lostReport The lost report
     * @return Calculated reward amount
     */
    public Double calculateReward(LostReport lostReport) {
        // If owner has set a specific reward, use that as minimum
        Double ownerReward = lostReport.getRewardAmount();

        // Calculate dynamic reward
        Double dynamicReward = calculateDynamicReward(lostReport);

        // Use the higher of owner's reward or dynamic calculation
        Double finalReward = (ownerReward != null && ownerReward > 0)
                ? Math.max(ownerReward, dynamicReward)
                : dynamicReward;

        log.info("Calculated reward for lost report {}: Owner={}, Dynamic={}, Final={}",
                lostReport.getId(), ownerReward, dynamicReward, finalReward);

        return finalReward;
    }

    /**
     * Calculate dynamic reward based on multiple factors
     */
    private Double calculateDynamicReward(LostReport lostReport) {
        // 1. Base reward by category
        Double baseReward = CATEGORY_BASE_REWARDS.getOrDefault(
                lostReport.getCategory(),
                CATEGORY_BASE_REWARDS.get("Other"));

        // 2. Time factor - add bonus for items lost longer ago
        Double timeFactor = calculateTimeFactor(lostReport.getLostAt());

        // 3. Urgency factor - items with more details show urgency
        Double urgencyFactor = calculateUrgencyFactor(lostReport);

        // 4. Location factor - certain locations might have higher rewards
        Double locationFactor = 1.0; // Can be enhanced based on location

        // Calculate total reward
        Double totalReward = baseReward * timeFactor * urgencyFactor * locationFactor;

        // Round to 2 decimal places
        return Math.round(totalReward * 100.0) / 100.0;
    }

    /**
     * Calculate time-based multiplier
     * Items lost longer ago get slightly higher rewards
     */
    private Double calculateTimeFactor(OffsetDateTime lostAt) {
        if (lostAt == null) {
            return 1.0;
        }

        Duration duration = Duration.between(lostAt, OffsetDateTime.now());
        long daysLost = duration.toDays();

        if (daysLost < 1) {
            return 1.0; // Same day
        } else if (daysLost < 7) {
            return 1.1; // Within a week - 10% bonus
        } else if (daysLost < 30) {
            return 1.2; // Within a month - 20% bonus
        } else if (daysLost < 90) {
            return 1.3; // Within 3 months - 30% bonus
        } else {
            return 1.5; // Over 3 months - 50% bonus
        }
    }

    /**
     * Calculate urgency factor based on item details
     * More detailed descriptions show higher urgency/importance
     */
    private Double calculateUrgencyFactor(LostReport lostReport) {
        double factor = 1.0;

        // Has detailed description
        if (lostReport.getDescription() != null &&
                lostReport.getDescription().length() > 50) {
            factor += 0.1;
        }

        // Has images
        if (lostReport.getImages() != null && !lostReport.getImages().isEmpty()) {
            factor += 0.1;
        }

        // Has specific characteristics (color, brand)
        if (lostReport.getColor() != null && !lostReport.getColor().isEmpty()) {
            factor += 0.05;
        }

        if (lostReport.getBrand() != null && !lostReport.getBrand().isEmpty()) {
            factor += 0.05;
        }

        // Has tags
        if (lostReport.getTags() != null && !lostReport.getTags().isEmpty()) {
            factor += 0.1;
        }

        return factor;
    }

    /**
     * Calculate score/reputation points earned from reward
     * 1 coin = 0.1 reputation points
     */
    public Integer calculateReputationPoints(Double rewardAmount) {
        if (rewardAmount == null || rewardAmount <= 0) {
            return 0;
        }
        // 10 coins = 1 reputation point
        return (int) Math.round(rewardAmount / 10.0);
    }

    /**
     * Get reward breakdown for transparency
     */
    public Map<String, Object> getRewardBreakdown(LostReport lostReport) {
        Map<String, Object> breakdown = new HashMap<>();

        Double baseReward = CATEGORY_BASE_REWARDS.getOrDefault(
                lostReport.getCategory(),
                CATEGORY_BASE_REWARDS.get("Other"));

        Double timeFactor = calculateTimeFactor(lostReport.getLostAt());
        Double urgencyFactor = calculateUrgencyFactor(lostReport);
        Double ownerReward = lostReport.getRewardAmount();
        Double dynamicReward = calculateDynamicReward(lostReport);
        Double finalReward = (ownerReward != null && ownerReward > 0)
                ? Math.max(ownerReward, dynamicReward)
                : dynamicReward;

        breakdown.put("baseReward", baseReward);
        breakdown.put("timeFactor", timeFactor);
        breakdown.put("urgencyFactor", urgencyFactor);
        breakdown.put("ownerSetReward", ownerReward);
        breakdown.put("dynamicCalculation", dynamicReward);
        breakdown.put("finalReward", finalReward);
        breakdown.put("reputationPoints", calculateReputationPoints(finalReward));

        return breakdown;
    }
}
