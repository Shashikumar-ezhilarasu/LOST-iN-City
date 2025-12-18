package com.lostcity.controller;

import com.lostcity.dto.response.ApiResponse;
import com.lostcity.model.Transaction;
import com.lostcity.service.CurrencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final CurrencyService currencyService;

    @GetMapping("/balance")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getBalance() {
        Double balance = currencyService.getCurrentUserBalance();
        return ResponseEntity.ok(ApiResponse.success(Map.of("balance", balance, "coins", balance)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<CurrencyService.WalletStats>> getWalletStats() {
        CurrencyService.WalletStats stats = currencyService.getWalletStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactions() {
        List<Transaction> transactions = currencyService.getUserTransactions(
                currencyService.userService.getCurrentUser());
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @PostMapping("/tip")
    public ResponseEntity<ApiResponse<Transaction>> sendTip(@RequestBody Map<String, Object> request) {
        String recipientId = (String) request.get("recipient_id");
        Double amount = ((Number) request.get("amount")).doubleValue();
        String message = (String) request.get("message");

        if (recipientId == null || amount == null || amount <= 0) {
            throw new RuntimeException("Invalid tip request");
        }

        Transaction transaction = currencyService.sendTip(recipientId, amount, message);
        return ResponseEntity.ok(ApiResponse.success(transaction));
    }

    @PostMapping("/claim-daily-bonus")
    public ResponseEntity<ApiResponse<Transaction>> claimDailyBonus() {
        Transaction transaction = currencyService.awardDailyBonus(
                currencyService.userService.getCurrentUser());
        return ResponseEntity.ok(ApiResponse.success(transaction));
    }

    /**
     * Add coins to user account (purchase/add funds)
     * In production, this would integrate with payment gateway
     */
    @PostMapping("/add-coins")
    public ResponseEntity<ApiResponse<Transaction>> addCoins(@RequestBody Map<String, Object> request) {
        Double amount = ((Number) request.get("amount")).doubleValue();
        String paymentMethod = (String) request.getOrDefault("payment_method", "manual");

        if (amount == null || amount <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        // In production, verify payment here
        Transaction transaction = currencyService.creditCoins(
                currencyService.userService.getCurrentUser(),
                amount,
                Transaction.TransactionType.PURCHASE,
                "Added coins via " + paymentMethod,
                String.format("{\"payment_method\":\"%s\"}", paymentMethod));

        return ResponseEntity.ok(ApiResponse.success(transaction));
    }

    /**
     * Update current user's coin balance to 1000 if less than 1000
     */
    @PostMapping("/reset-to-minimum")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resetToMinimum() {
        var user = currencyService.userService.getCurrentUser();
        double originalBalance = user.getCoins();

        if (originalBalance < 1000.0) {
            double difference = 1000.0 - originalBalance;
            Transaction transaction = currencyService.creditCoins(
                    user,
                    difference,
                    Transaction.TransactionType.PURCHASE,
                    "Account balance adjustment to 1000 coins minimum",
                    "{\"type\":\"balance_adjustment\"}");

            return ResponseEntity.ok(ApiResponse.success(Map.of(
                    "message", "Balance updated to 1000 coins",
                    "previous_balance", originalBalance,
                    "new_balance", 1000.0,
                    "added", difference,
                    "transaction_id", transaction.getId())));
        } else {
            return ResponseEntity.ok(ApiResponse.success(Map.of(
                    "message", "Balance already sufficient",
                    "current_balance", originalBalance)));
        }
    }

    /**
     * ADMIN ONLY: Update ALL users to have minimum 1000 coins
     * This updates the database directly for all existing users
     */
    @PostMapping("/admin/update-all-balances")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateAllBalances() {
        try {
            long updated = currencyService.updateAllUsersToMinimumBalance();
            return ResponseEntity.ok(ApiResponse.success(Map.of(
                    "message", "All users updated to minimum 1000 coins",
                    "users_updated", updated)));
        } catch (Exception e) {
            throw new RuntimeException("Failed to update users: " + e.getMessage(), e);
        }
    }
}
