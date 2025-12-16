package com.lostcity.controller;

import com.lostcity.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class UtilityController {

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        List<String> categories = Arrays.asList(
                "electronics",
                "pets",
                "documents",
                "jewelry",
                "clothing",
                "bags",
                "keys",
                "books",
                "sports_equipment",
                "toys",
                "other");
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/tags/suggest")
    public ResponseEntity<ApiResponse<List<String>>> suggestTags(@RequestParam String q) {
        List<String> suggestions = Arrays.asList(
                "urgent",
                "reward_offered",
                "sentimental_value",
                "near_station",
                "near_park",
                "valuable").stream()
                .filter(tag -> tag.toLowerCase().contains(q.toLowerCase()))
                .toList();

        return ResponseEntity.ok(ApiResponse.success(suggestions));
    }
}
