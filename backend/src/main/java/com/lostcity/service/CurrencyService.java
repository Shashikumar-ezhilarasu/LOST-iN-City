package com.lostcity.service;

import com.lostcity.model.Transaction;
import com.lostcity.model.User;
import com.lostcity.repository.TransactionRepository;
import com.lostcity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CurrencyService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    public final UserService userService;

    /**
     * Add coins to a user's wallet
     */
    @Transactional
    public Transaction creditCoins(User user, Double amount, Transaction.TransactionType type,
            String description, String metadata) {
        if (amount <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        // Update user balance
        user.setCoins(user.getCoins() + amount);
        user.setLifetimeEarnings(user.getLifetimeEarnings() + amount);
        userRepository.save(user);

        // Create transaction record
        Transaction transaction = Transaction.builder()
                .fromUser(null) // System credit
                .toUser(user)
                .amount(amount)
                .type(type)
                .status(Transaction.TransactionStatus.COMPLETED)
                .description(description)
                .metadata(metadata)
                .build();

        return transactionRepository.save(transaction);
    }

    /**
     * Deduct coins from a user's wallet
     */
    @Transactional
    public Transaction debitCoins(User user, Double amount, Transaction.TransactionType type,
            String description, String metadata) {
        if (amount <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        if (user.getCoins() < amount) {
            throw new RuntimeException("Insufficient coins. You have " + user.getCoins() + " coins but need " + amount);
        }

        // Update user balance
        user.setCoins(user.getCoins() - amount);
        user.setLifetimeSpent(user.getLifetimeSpent() + amount);
        userRepository.save(user);

        // Create transaction record
        Transaction transaction = Transaction.builder()
                .fromUser(user)
                .toUser(null) // System debit
                .amount(amount)
                .type(type)
                .status(Transaction.TransactionStatus.COMPLETED)
                .description(description)
                .metadata(metadata)
                .build();

        return transactionRepository.save(transaction);
    }

    /**
     * Transfer coins from one user to another
     */
    @Transactional
    public Transaction transferCoins(User fromUser, User toUser, Double amount,
            Transaction.TransactionType type, String description) {
        if (amount <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        if (fromUser.getCoins() < amount) {
            throw new RuntimeException("Insufficient coins");
        }

        if (fromUser.getId().equals(toUser.getId())) {
            throw new RuntimeException("Cannot transfer coins to yourself");
        }

        // Deduct from sender
        fromUser.setCoins(fromUser.getCoins() - amount);
        fromUser.setLifetimeSpent(fromUser.getLifetimeSpent() + amount);

        // Add to recipient
        toUser.setCoins(toUser.getCoins() + amount);
        toUser.setLifetimeEarnings(toUser.getLifetimeEarnings() + amount);

        userRepository.save(fromUser);
        userRepository.save(toUser);

        // Create transaction record
        Transaction transaction = Transaction.builder()
                .fromUser(fromUser)
                .toUser(toUser)
                .amount(amount)
                .type(type)
                .status(Transaction.TransactionStatus.COMPLETED)
                .description(description)
                .build();

        return transactionRepository.save(transaction);
    }

    /**
     * Award reward coins for finding and returning an item
     * Note: Score/reputation is calculated separately in ClaimService using
     * RewardCalculationService
     */
    @Transactional
    public Transaction awardItemReward(User finder, Double amount, String lostReportId, String claimId) {
        String description = "Reward for helping return a lost item";
        String metadata = String.format("{\"lostReportId\":\"%s\",\"claimId\":\"%s\"}", lostReportId, claimId);

        Transaction transaction = creditCoins(finder, amount, Transaction.TransactionType.REWARD, description,
                metadata);
        transaction.setRelatedLostReportId(lostReportId);
        transaction.setRelatedClaimId(claimId);

        // Note: Score is now calculated in ClaimService to avoid duplication
        // No score update here - handled by RewardCalculationService

        return transactionRepository.save(transaction);
    }

    /**
     * Award quest completion reward
     */
    @Transactional
    public Transaction awardQuestReward(User user, Double amount, String questId) {
        String description = "Reward for completing a quest";
        String metadata = String.format("{\"questId\":\"%s\"}", questId);

        Transaction transaction = creditCoins(user, amount, Transaction.TransactionType.QUEST_REWARD, description,
                metadata);
        transaction.setRelatedQuestId(questId);

        return transactionRepository.save(transaction);
    }

    /**
     * Award daily login bonus
     */
    @Transactional
    public Transaction awardDailyBonus(User user) {
        Double bonusAmount = 10.0; // 10 coins daily bonus
        String description = "Daily login bonus";

        return creditCoins(user, bonusAmount, Transaction.TransactionType.BONUS, description, null);
    }

    /**
     * Send tip to another user
     */
    @Transactional
    public Transaction sendTip(String recipientId, Double amount, String message) {
        User sender = userService.getCurrentUser();
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        String description = message != null ? "Tip: " + message : "Tip from " + sender.getDisplayName();

        return transferCoins(sender, recipient, amount, Transaction.TransactionType.TIP, description);
    }

    /**
     * Get user's transaction history
     */
    @Transactional(readOnly = true)
    public List<Transaction> getUserTransactions(User user) {
        List<Transaction> received = transactionRepository.findByToUserOrderByCreatedAtDesc(user);
        List<Transaction> sent = transactionRepository.findByFromUserOrderByCreatedAtDesc(user);

        // Merge and sort by date
        received.addAll(sent);
        received.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        return received;
    }

    /**
     * Get current user's wallet balance
     */
    @Transactional(readOnly = true)
    public Double getCurrentUserBalance() {
        User user = userService.getCurrentUser();
        return user.getCoins();
    }

    /**
     * Check if user has enough coins
     */
    public boolean hasEnoughCoins(User user, Double amount) {
        return user.getCoins() >= amount;
    }

    /**
     * Get wallet statistics for user
     */
    @Transactional(readOnly = true)
    public WalletStats getWalletStats() {
        User user = userService.getCurrentUser();

        return WalletStats.builder()
                .currentBalance(user.getCoins())
                .lifetimeEarnings(user.getLifetimeEarnings())
                .lifetimeSpent(user.getLifetimeSpent())
                .itemsReturned(user.getItemsReturnedCount())
                .score(user.getScore())
                .build();
    }

    @lombok.Data
    @lombok.Builder
    public static class WalletStats {
        private Double currentBalance;
        private Double lifetimeEarnings;
        private Double lifetimeSpent;
        private Integer itemsReturned;
        private Integer score;
    }
}
