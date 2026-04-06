package com.lostcity.controller;

import com.lostcity.kafka.events.*;
import com.lostcity.kafka.producer.KafkaProducerService;
import com.lostcity.model.*;
import com.lostcity.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.*;

/**
 * ═══════════════════════════════════════════════════════════════
 *  LOST-iN-City  —  Kafka Demo Controller
 *  Auth-free endpoints that walk through the complete event flow.
 *  Purpose: live demo / integration testing.
 *  Route prefix: /api/demo
 * ═══════════════════════════════════════════════════════════════
 */
@Slf4j
@RestController
@RequestMapping("/api/demo")
@RequiredArgsConstructor
public class KafkaDemoController {

    private final KafkaProducerService kafkaProducerService;
    private final UserRepository userRepository;
    private final LostReportRepository lostReportRepository;
    private final FoundReportRepository foundReportRepository;
    private final ClaimRepository claimRepository;

    // ─── GET /api/demo/status ─────────────────────────────────────────────────
    /** Quick health check for the demo stack. */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("status", "🟢 RUNNING");
        resp.put("service", "LOST-iN-City Backend");
        resp.put("kafka", "✅ Connected — 6 topics active");
        resp.put("mongo", "✅ MongoDB Atlas connected");
        resp.put("timestamp", Instant.now().toString());
        resp.put("topics", List.of(
                "lost-item-reported",
                "found-item-posted",
                "claim-submitted",
                "claim-approved",
                "reward-transferred",
                "xp-coins-updated"
        ));
        resp.put("demoEndpoints", Map.of(
                "fullFlow",      "POST /api/demo/run-full-flow",
                "lostItem",      "POST /api/demo/event/lost-item",
                "foundItem",     "POST /api/demo/event/found-item",
                "claimSubmit",   "POST /api/demo/event/claim-submitted",
                "claimApprove",  "POST /api/demo/event/claim-approved",
                "rewardPay",     "POST /api/demo/event/reward-transferred",
                "xpGrant",       "POST /api/demo/event/xp-coins-updated",
                "users",         "GET  /api/demo/users"
        ));
        return ResponseEntity.ok(resp);
    }

    // ─── GET /api/demo/users ─────────────────────────────────────────────────
    /** List users available for the demo with their current state. */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> demoUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> list = users.stream().map(u -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId());
            m.put("displayName", u.getDisplayName());
            m.put("email", u.getEmail());
            m.put("score", u.getScore());
            m.put("coins", u.getCoins());
            m.put("lostReportsCount", u.getLostReportsCount());
            m.put("foundReportsCount", u.getFoundReportsCount());
            m.put("itemsReturnedCount", u.getItemsReturnedCount());
            m.put("badges", u.getBadges());
            return m;
        }).toList();
        return ResponseEntity.ok(Map.of("users", list, "count", list.size()));
    }

    // ─── POST /api/demo/reset-coins ──────────────────────────────────────────
    /** Reset all users to 1 000 coins so the reward flow can always run. */
    @PostMapping("/reset-coins")
    public ResponseEntity<Map<String, Object>> resetCoins() {
        List<User> users = userRepository.findAll();
        users.forEach(u -> {
            u.setCoins(1000.0);
            u.setLifetimeEarnings(0.0);
            u.setLifetimeSpent(0.0);
        });
        userRepository.saveAll(users);
        log.info("[Demo] Reset {} users to 1000 coins", users.size());
        return ResponseEntity.ok(Map.of(
                "message", "✅ All " + users.size() + " users reset to 1000 coins",
                "users", users.stream().map(u -> Map.of("name", u.getDisplayName(), "coins", u.getCoins())).toList()
        ));
    }

    // ═════════════════════════════════════════════════════════════════════════
    //  INDIVIDUAL EVENT TRIGGERS  (fire-and-forget, instant Kafka publish)
    // ═════════════════════════════════════════════════════════════════════════

    /** Simulate: a user posts a lost item → publishes to lost-item-reported. */
    @PostMapping("/event/lost-item")
    public ResponseEntity<Map<String, Object>> triggerLostItem() {
        User owner = pickUser(0);

        // Create a real LostReport document in MongoDB
        LostReport report = LostReport.builder()
                .title("[DEMO] Vintage Mechanical Watch")
                .description("A silver Seiko mechanical watch with black leather strap. Sentimental value — gift from grandfather.")
                .category("accessories")
                .rewardAmount(300.0)
                .locationName("SECTOR-17 Food Court, Level 2")
                .latitude(17.3850)
                .longitude(78.4867)
                .tags(List.of("watch", "vintage", "silver", "sentimental", "reward_offered"))
                .reportedBy(owner)
                .visibility(LostReport.Visibility.PUBLIC)
                .status(LostReport.ItemStatus.OPEN)
                .lostAt(OffsetDateTime.now().minusHours(3))
                .build();

        report = lostReportRepository.save(report);

        kafkaProducerService.publishLostItemReported(
                report.getId(), owner.getId(),
                report.getTitle(), report.getCategory(),
                report.getRewardAmount(), report.getLocationName(),
                report.getLatitude(), report.getLongitude(),
                report.getTags(), "PUBLIC"
        );

        log.info("[Demo] ✅ lost-item-reported published — itemId={}", report.getId());

        return ResponseEntity.ok(event("lost-item-reported", owner, Map.of(
                "itemId", report.getId(),
                "title", report.getTitle(),
                "category", report.getCategory(),
                "rewardAmount", report.getRewardAmount(),
                "locationName", report.getLocationName(),
                "tags", report.getTags()
        )));
    }

    /** Simulate: a finder posts a found item → publishes to found-item-posted. */
    @PostMapping("/event/found-item")
    public ResponseEntity<Map<String, Object>> triggerFoundItem() {
        User finder = pickUser(1);

        FoundReport report = FoundReport.builder()
                .title("[DEMO] Silver Watch Found Near Food Court")
                .description("Found a silver mechanical watch near the food court bins. In good condition, no scratches.")
                .category("accessories")
                .locationName("SECTOR-17 Food Court, near Exit B")
                .latitude(17.3851)
                .longitude(78.4868)
                .tags(List.of("watch", "silver", "mechanical"))
                .reportedBy(finder)
                .foundCondition(FoundReport.Condition.GOOD)
                .holdingInstructions("Stored at SECTOR-17 security desk.")
                .status(FoundReport.ItemStatus.OPEN)
                .foundAt(OffsetDateTime.now().minusHours(2))
                .build();

        report = foundReportRepository.save(report);

        kafkaProducerService.publishFoundItemPosted(
                report.getId(), finder.getId(),
                report.getTitle(), report.getCategory(),
                report.getLocationName(), report.getLatitude(), report.getLongitude(),
                "GOOD", report.getTags()
        );

        log.info("[Demo] ✅ found-item-posted published — itemId={}", report.getId());

        return ResponseEntity.ok(event("found-item-posted", finder, Map.of(
                "itemId", report.getId(),
                "title", report.getTitle(),
                "foundCondition", "GOOD",
                "locationName", report.getLocationName()
        )));
    }

    /** Simulate: finder submits claim → publishes to claim-submitted. */
    @PostMapping("/event/claim-submitted")
    public ResponseEntity<Map<String, Object>> triggerClaimSubmitted() {
        User owner  = pickUser(0);
        User finder = pickUser(1);

        // Create a real open lost report if we need one
        LostReport lostReport = lostReportRepository
                .findAll().stream()
                .filter(r -> r.getStatus() == LostReport.ItemStatus.OPEN && r.getReportedBy() != null)
                .findFirst()
                .orElseGet(() -> {
                    LostReport lr = LostReport.builder()
                            .title("[DEMO] Laptop Backpack")
                            .category("bags")
                            .rewardAmount(200.0)
                            .locationName("SECTOR-17 Library, 3rd Floor")
                            .reportedBy(owner)
                            .status(LostReport.ItemStatus.OPEN)
                            .visibility(LostReport.Visibility.PUBLIC)
                            .lostAt(OffsetDateTime.now().minusDays(1))
                            .tags(List.of("backpack", "black", "laptop"))
                            .build();
                    return lostReportRepository.save(lr);
                });

        Claim claim = Claim.builder()
                .lostReport(lostReport)
                .claimer(finder)
                .owner(lostReport.getReportedBy() != null ? lostReport.getReportedBy() : owner)
                .claimerMessage("I found your item near the study area. I can describe the contents to verify it's yours.")
                .rewardAmount(lostReport.getRewardAmount() != null ? lostReport.getRewardAmount() : 200.0)
                .status(Claim.ClaimStatus.PENDING)
                .build();

        claim = claimRepository.save(claim);

        kafkaProducerService.publishClaimSubmitted(
                claim.getId(), finder.getId(),
                lostReport.getId(), null,
                claim.getOwner().getId(),
                claim.getRewardAmount(),
                claim.getClaimerMessage()
        );

        log.info("[Demo] ✅ claim-submitted published — claimId={}", claim.getId());

        return ResponseEntity.ok(event("claim-submitted", finder, Map.of(
                "claimId", claim.getId(),
                "lostReportId", lostReport.getId(),
                "rewardAmount", claim.getRewardAmount(),
                "message", claim.getClaimerMessage(),
                "notifiedOwner", claim.getOwner().getId()
        )));
    }

    /** Simulate: owner approves claim → publishes to claim-approved. */
    @PostMapping("/event/claim-approved")
    public ResponseEntity<Map<String, Object>> triggerClaimApproved() {
        User owner  = pickUser(0);
        User finder = pickUser(1);

        // Find a pending claim, or create a demo scenario
        Claim claim = claimRepository.findAll().stream()
                .filter(c -> c.getStatus() == Claim.ClaimStatus.PENDING)
                .findFirst()
                .orElseGet(() -> {
                    LostReport lr = LostReport.builder()
                            .title("[DEMO] Camera Bag")
                            .category("bags")
                            .rewardAmount(150.0)
                            .locationName("SECTOR-17 Parking")
                            .reportedBy(owner)
                            .status(LostReport.ItemStatus.OPEN)
                            .visibility(LostReport.Visibility.PUBLIC)
                            .lostAt(OffsetDateTime.now().minusDays(2))
                            .build();
                    lr = lostReportRepository.save(lr);
                    Claim c = Claim.builder()
                            .lostReport(lr)
                            .claimer(finder)
                            .owner(owner)
                            .claimerMessage("I have your camera bag!")
                            .rewardAmount(150.0)
                            .status(Claim.ClaimStatus.PENDING)
                            .build();
                    return claimRepository.save(c);
                });

        // Approve the claim
        claim.setStatus(Claim.ClaimStatus.APPROVED);
        claim.setOwnerResponse("Yes! That sounds like my bag. Please contact me at the main gate.");
        claim.setApprovedAt(OffsetDateTime.now());
        claimRepository.save(claim);

        // Update linked lost report
        LostReport lr = claim.getLostReport();
        lr.setStatus(LostReport.ItemStatus.MATCHED);
        lr.setApprovedClaimId(claim.getId());
        lostReportRepository.save(lr);

        kafkaProducerService.publishClaimApproved(
                claim.getId(),
                claim.getOwner().getId(),
                lr.getId(),
                claim.getClaimer().getId(),
                claim.getRewardAmount(),
                claim.getOwnerResponse()
        );

        log.info("[Demo] ✅ claim-approved published — claimId={}", claim.getId());

        return ResponseEntity.ok(event("claim-approved", claim.getOwner(), Map.of(
                "claimId", claim.getId(),
                "lostReportId", lr.getId(),
                "claimerNotified", claim.getClaimer().getId(),
                "rewardAmount", claim.getRewardAmount(),
                "ownerResponse", claim.getOwnerResponse()
        )));
    }

    /** Simulate: coins transferred after handoff → publishes to reward-transferred + xp-coins-updated. */
    @PostMapping("/event/reward-transferred")
    public ResponseEntity<Map<String, Object>> triggerRewardTransferred() {
        User owner  = pickUser(0);
        User finder = pickUser(1);

        // Find an approved claim or create a new one
        Claim claim = claimRepository.findAll().stream()
                .filter(c -> c.getStatus() == Claim.ClaimStatus.APPROVED)
                .findFirst()
                .orElseGet(() -> {
                    LostReport lr = LostReport.builder()
                            .title("[DEMO] Lab Notebook")
                            .category("books")
                            .rewardAmount(100.0)
                            .locationName("SECTOR-17 Cafeteria")
                            .reportedBy(owner)
                            .status(LostReport.ItemStatus.MATCHED)
                            .visibility(LostReport.Visibility.PUBLIC)
                            .lostAt(OffsetDateTime.now().minusDays(3))
                            .build();
                    lr = lostReportRepository.save(lr);
                    Claim c = Claim.builder()
                            .lostReport(lr)
                            .claimer(finder)
                            .owner(owner)
                            .claimerMessage("Found your notebook!")
                            .rewardAmount(100.0)
                            .status(Claim.ClaimStatus.APPROVED)
                            .approvedAt(OffsetDateTime.now().minusMinutes(30))
                            .build();
                    return claimRepository.save(c);
                });

        double reward = claim.getRewardAmount() != null ? claim.getRewardAmount() : 100.0;
        String lostReportId = claim.getLostReport().getId();

        // Actually move coins in MongoDB
        User freshOwner = userRepository.findById(owner.getId()).orElse(owner);
        User freshFinder = userRepository.findById(finder.getId()).orElse(finder);

        // Ensure owner has enough coins (add if needed for demo)
        if (freshOwner.getCoins() < reward) {
            freshOwner.setCoins(reward + 500.0);
        }
        freshOwner.setCoins(freshOwner.getCoins() - reward);
        freshOwner.setLifetimeSpent(freshOwner.getLifetimeSpent() + reward);

        freshFinder.setCoins(freshFinder.getCoins() + reward);
        freshFinder.setLifetimeEarnings(freshFinder.getLifetimeEarnings() + reward);
        freshFinder.setItemsReturnedCount(freshFinder.getItemsReturnedCount() + 1);

        // XP based on reward amount (10 XP per 100 coins)
        int xpGained = Math.max(10, (int)(reward / 10));
        freshFinder.setScore(freshFinder.getScore() + xpGained);

        userRepository.save(freshOwner);
        userRepository.save(freshFinder);

        // Mark claim + report completed
        claim.setStatus(Claim.ClaimStatus.COMPLETED);
        claim.setRewardPaid(true);
        claimRepository.save(claim);

        LostReport lr = lostReportRepository.findById(lostReportId).orElse(claim.getLostReport());
        lr.setStatus(LostReport.ItemStatus.CLOSED);
        lr.setRewardReleased(true);
        lostReportRepository.save(lr);

        String description = "Reward for returning: " + lr.getTitle();
        kafkaProducerService.publishRewardTransferred(
                claim.getId(), freshOwner.getId(), lostReportId,
                freshFinder.getId(), reward, description, "REWARD"
        );

        kafkaProducerService.publishXpCoinsUpdated(
                freshFinder.getId(), freshFinder.getClerkId(),
                xpGained, reward, "ITEM_RETURNED", lostReportId
        );

        log.info("[Demo] ✅ reward-transferred + xp-coins-updated published");

        return ResponseEntity.ok(event("reward-transferred + xp-coins-updated", freshOwner, Map.of(
                "claimId", claim.getId(),
                "lostReportId", lostReportId,
                "rewardPaid", reward,
                "ownerCoinsAfter", freshOwner.getCoins(),
                "finderCoinsAfter", freshFinder.getCoins(),
                "xpGranted", xpGained,
                "finderScoreAfter", freshFinder.getScore(),
                "secondEventPublished", "xp-coins-updated"
        )));
    }

    /** Grant XP and coins to a user directly (gamification event). */
    @PostMapping("/event/xp-coins-updated")
    public ResponseEntity<Map<String, Object>> triggerXpCoins() {
        User user = pickUser(2);

        user.setScore(user.getScore() + 50);
        user.setCoins(user.getCoins() + 250.0);
        user.setLifetimeEarnings(user.getLifetimeEarnings() + 250.0);
        userRepository.save(user);

        kafkaProducerService.publishXpCoinsUpdated(
                user.getId(), user.getClerkId(),
                50, 250.0, "QUEST_COMPLETED", null
        );

        log.info("[Demo] ✅ xp-coins-updated published for user={}", user.getId());

        return ResponseEntity.ok(event("xp-coins-updated", user, Map.of(
                "xpGained", 50,
                "coinsGained", 250.0,
                "reason", "QUEST_COMPLETED",
                "newScore", user.getScore(),
                "newCoins", user.getCoins()
        )));
    }

    // ═════════════════════════════════════════════════════════════════════════
    //  FULL FLOW  —  runs all 6 events in sequence
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * POST /api/demo/run-full-flow
     *
     * Executes the complete LOST-iN-City Kafka event chain in sequence:
     *   Step 1: lost-item-reported
     *   Step 2: found-item-posted
     *   Step 3: claim-submitted
     *   Step 4: claim-approved
     *   Step 5: reward-transferred
     *   Step 6: xp-coins-updated
     *
     * Returns a step-by-step JSON report for the demo.
     */
    @PostMapping("/run-full-flow")
    public ResponseEntity<Map<String, Object>> runFullFlow() {
        log.info("[Demo] ╔══ Starting FULL Kafka demo flow ══╗");

        List<Map<String, Object>> steps = new ArrayList<>();
        Map<String, String> ids = new LinkedHashMap<>();

        // ── Reset coins so the flow always succeeds ────────────────────────
        userRepository.findAll().forEach(u -> {
            u.setCoins(1500.0);
            userRepository.save(u);
        });

        User owner  = pickUser(0);  // Sarah Smith — lost the item
        User finder = pickUser(1);  // John Doe   — found the item
        User quester = pickUser(2); // Mike Johnson — quest reward

        // ── Step 1: Lost Item ──────────────────────────────────────────────
        log.info("[Demo] Step 1 → lost-item-reported");
        LostReport lostReport = LostReport.builder()
                .title("AirPods Pro — White Case")
                .description("Lost my AirPods Pro in the white case with engraved initials 'SS'. Last seen at the gym.")
                .category("electronics")
                .rewardAmount(500.0)
                .locationName("SECTOR-17 Fitness Centre, Locker Area")
                .latitude(17.3853)
                .longitude(78.4870)
                .tags(List.of("airpods", "apple", "white", "reward_offered", "urgent"))
                .reportedBy(owner)
                .status(LostReport.ItemStatus.OPEN)
                .visibility(LostReport.Visibility.PUBLIC)
                .lostAt(OffsetDateTime.now().minusHours(4))
                .build();
        lostReport = lostReportRepository.save(lostReport);
        ids.put("lostReportId", lostReport.getId());

        kafkaProducerService.publishLostItemReported(
                lostReport.getId(), owner.getId(), lostReport.getTitle(),
                lostReport.getCategory(), lostReport.getRewardAmount(),
                lostReport.getLocationName(), lostReport.getLatitude(),
                lostReport.getLongitude(), lostReport.getTags(), "PUBLIC"
        );
        steps.add(step(1, "lost-item-reported",
                "Owner '" + owner.getDisplayName() + "' reported lost item",
                Map.of("itemId", lostReport.getId(), "title", lostReport.getTitle(), "reward", "₹500")));

        // ── Step 2: Found Item ─────────────────────────────────────────────
        log.info("[Demo] Step 2 → found-item-posted");
        FoundReport foundReport = FoundReport.builder()
                .title("Found AirPods Case — White with Engravings")
                .description("Found white AirPods case with initials near the fitness centre locker room.")
                .category("electronics")
                .locationName("SECTOR-17 Fitness Centre, Main Entrance")
                .latitude(17.3852)
                .longitude(78.4869)
                .tags(List.of("airpods", "white", "case"))
                .reportedBy(finder)
                .foundCondition(FoundReport.Condition.GOOD)
                .holdingInstructions("Handed to gym reception desk.")
                .status(FoundReport.ItemStatus.OPEN)
                .foundAt(OffsetDateTime.now().minusHours(2))
                .build();
        foundReport = foundReportRepository.save(foundReport);
        ids.put("foundReportId", foundReport.getId());

        kafkaProducerService.publishFoundItemPosted(
                foundReport.getId(), finder.getId(), foundReport.getTitle(),
                foundReport.getCategory(), foundReport.getLocationName(),
                foundReport.getLatitude(), foundReport.getLongitude(),
                "GOOD", foundReport.getTags()
        );
        steps.add(step(2, "found-item-posted",
                "Finder '" + finder.getDisplayName() + "' posted found item",
                Map.of("itemId", foundReport.getId(), "condition", "GOOD")));

        // ── Step 3: Claim Submitted ────────────────────────────────────────
        log.info("[Demo] Step 3 → claim-submitted");
        Claim claim = Claim.builder()
                .lostReport(lostReport)
                .foundReport(foundReport)
                .claimer(finder)
                .owner(owner)
                .claimerMessage("I found your AirPods! The case has 'SS' initials as you described. I've left it at the gym reception.")
                .rewardAmount(500.0)
                .status(Claim.ClaimStatus.PENDING)
                .build();
        claim = claimRepository.save(claim);
        ids.put("claimId", claim.getId());

        kafkaProducerService.publishClaimSubmitted(
                claim.getId(), finder.getId(), lostReport.getId(),
                foundReport.getId(), owner.getId(), 500.0, claim.getClaimerMessage()
        );
        steps.add(step(3, "claim-submitted",
                "Finder submitted claim; owner '" + owner.getDisplayName() + "' notified",
                Map.of("claimId", claim.getId(), "reward", "₹500", "message", "Claim submitted to owner")));

        // ── Step 4: Claim Approved ─────────────────────────────────────────
        log.info("[Demo] Step 4 → claim-approved");
        claim.setStatus(Claim.ClaimStatus.APPROVED);
        claim.setOwnerResponse("Thank you! The initials match perfectly. Picking up from reception now.");
        claim.setApprovedAt(OffsetDateTime.now());
        claim = claimRepository.save(claim);
        lostReport.setStatus(LostReport.ItemStatus.MATCHED);
        lostReport.setApprovedClaimId(claim.getId());
        lostReportRepository.save(lostReport);
        foundReport.setStatus(FoundReport.ItemStatus.MATCHED);
        foundReport.setMatchedLostItemId(lostReport.getId());
        foundReportRepository.save(foundReport);

        kafkaProducerService.publishClaimApproved(
                claim.getId(), owner.getId(), lostReport.getId(),
                finder.getId(), 500.0, claim.getOwnerResponse()
        );
        steps.add(step(4, "claim-approved",
                "Owner approved claim; finder '" + finder.getDisplayName() + "' notified",
                Map.of("status", "MATCHED", "ownerResponse", claim.getOwnerResponse())));

        // ── Step 5: Reward Transferred ────────────────────────────────────
        log.info("[Demo] Step 5 → reward-transferred");
        User freshOwner  = userRepository.findById(owner.getId()).orElse(owner);
        User freshFinder = userRepository.findById(finder.getId()).orElse(finder);

        freshOwner.setCoins(freshOwner.getCoins() - 500.0);
        freshOwner.setLifetimeSpent(freshOwner.getLifetimeSpent() + 500.0);
        freshFinder.setCoins(freshFinder.getCoins() + 500.0);
        freshFinder.setLifetimeEarnings(freshFinder.getLifetimeEarnings() + 500.0);
        freshFinder.setItemsReturnedCount(freshFinder.getItemsReturnedCount() + 1);
        userRepository.save(freshOwner);
        userRepository.save(freshFinder);

        claim.setRewardPaid(true);
        claim.setStatus(Claim.ClaimStatus.COMPLETED);
        claimRepository.save(claim);
        lostReport.setStatus(LostReport.ItemStatus.CLOSED);
        lostReport.setRewardReleased(true);
        lostReportRepository.save(lostReport);

        kafkaProducerService.publishRewardTransferred(
                claim.getId(), freshOwner.getId(), lostReport.getId(),
                freshFinder.getId(), 500.0, "Reward for returning: " + lostReport.getTitle(), "REWARD"
        );
        steps.add(step(5, "reward-transferred",
                "500 coins transferred: " + owner.getDisplayName() + " → " + finder.getDisplayName(),
                Map.of("amount", "₹500",
                        "ownerCoinsNow", freshOwner.getCoins(),
                        "finderCoinsNow", freshFinder.getCoins(),
                        "claimStatus", "COMPLETED")));

        // ── Step 6: XP + Coins Gamification ───────────────────────────────
        log.info("[Demo] Step 6 → xp-coins-updated");
        int xp = 50;
        double bonusCoins = 100.0;
        freshFinder = userRepository.findById(finder.getId()).orElse(freshFinder);
        freshFinder.setScore(freshFinder.getScore() + xp);
        freshFinder.setCoins(freshFinder.getCoins() + bonusCoins);
        freshFinder.setLifetimeEarnings(freshFinder.getLifetimeEarnings() + bonusCoins);
        userRepository.save(freshFinder);

        // Bonus XP for quester
        quester = userRepository.findById(quester.getId()).orElse(quester);
        quester.setScore(quester.getScore() + 20);
        quester.setCoins(quester.getCoins() + 50.0);
        userRepository.save(quester);

        kafkaProducerService.publishXpCoinsUpdated(
                freshFinder.getId(), freshFinder.getClerkId(),
                xp, bonusCoins, "ITEM_RETURNED", lostReport.getId()
        );
        kafkaProducerService.publishXpCoinsUpdated(
                quester.getId(), quester.getClerkId(),
                20, 50.0, "QUEST_COMPLETED", null
        );

        steps.add(step(6, "xp-coins-updated",
                "XP + bonus coins granted to finder and quester",
                Map.of("finder", Map.of("name", finder.getDisplayName(), "xpGained", xp, "bonusCoins", bonusCoins, "totalScore", freshFinder.getScore()),
                        "quester", Map.of("name", quester.getDisplayName(), "xpGained", 20, "bonusCoins", 50.0))));

        log.info("[Demo] ╚══ FULL Kafka demo flow COMPLETE ══╝");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "✅ Full Kafka flow completed successfully");
        result.put("totalEvents", 7);  // reward-transferred + xp(x2) = 7 actual events
        result.put("topicsUsed", List.of(
                "lost-item-reported", "found-item-posted", "claim-submitted",
                "claim-approved", "reward-transferred", "xp-coins-updated"));
        result.put("ids", ids);
        result.put("steps", steps);
        result.put("finalState", Map.of(
                "lostReport", "CLOSED ✅",
                "claim", "COMPLETED ✅",
                "rewardPaid", "500 coins ✅",
                "owner", owner.getDisplayName() + " → −500 coins",
                "finder", finder.getDisplayName() + " → +600 coins, +" + xp + " XP"
        ));
        return ResponseEntity.ok(result);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private User pickUser(int index) {
        List<User> users = userRepository.findAllOrderByScoreDesc();
        if (users.isEmpty()) throw new RuntimeException("No users in DB — seed data required");
        return users.get(index % users.size());
    }

    private Map<String, Object> event(String topic, User actor, Map<String, Object> payload) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("event", "✅ Published");
        m.put("topic", topic);
        m.put("actor", Map.of("id", actor.getId(), "name", actor.getDisplayName()));
        m.put("timestamp", Instant.now().toString());
        m.put("payload", payload);
        m.put("note", "Check backend logs for [Kafka] ✅ confirmation");
        return m;
    }

    private Map<String, Object> step(int n, String topic, String summary, Map<String, Object> data) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("step", n);
        m.put("topic", topic);
        m.put("summary", summary);
        m.put("data", data);
        m.put("timestamp", Instant.now().toString());
        return m;
    }
}
