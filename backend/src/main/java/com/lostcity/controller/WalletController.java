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
}
