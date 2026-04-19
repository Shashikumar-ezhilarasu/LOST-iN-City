package com.lostcity.controller;

import com.lostcity.dto.response.AIMatchResponse;
import com.lostcity.service.AISuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AISuggestionController {

    private final AISuggestionService aiSuggestionService;

    @GetMapping("/matches")
    public ResponseEntity<List<AIMatchResponse>> getAIMatches() {
        return ResponseEntity.ok(aiSuggestionService.getSuggestionsForCurrentUser());
    }
}
