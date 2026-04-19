package com.lostcity.service;

import com.lostcity.dto.response.AIMatchResponse;
import com.lostcity.model.FoundReport;
import com.lostcity.model.LostReport;
import com.lostcity.model.User;
import com.lostcity.repository.FoundReportRepository;
import com.lostcity.repository.LostReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AISuggestionService {

    private final LostReportRepository lostReportRepository;
    private final FoundReportRepository foundReportRepository;
    private final GeminiService geminiService;
    private final UserService userService;

    public List<AIMatchResponse> getSuggestionsForCurrentUser() {
        User currentUser = userService.getCurrentUser();
        List<LostReport> myLostItems = lostReportRepository.findByReportedByOrderByCreatedAtDesc(currentUser)
                .stream()
                .filter(report -> "OPEN".equalsIgnoreCase(report.getStatus().name()))
                .collect(Collectors.toList());

        List<AIMatchResponse> allSuggestions = new ArrayList<>();

        for (LostReport lost : myLostItems) {
            // Find potential candidates (same category, OPEN status)
            List<FoundReport> candidates = foundReportRepository.findByCategory(lost.getCategory())
                    .stream()
                    .filter(found -> "OPEN".equalsIgnoreCase(found.getStatus().name()))
                    .limit(5) // Limit to avoid massive prompts
                    .collect(Collectors.toList());

            if (candidates.isEmpty()) continue;

            List<AIMatchResponse.MatchDetail> matches = new ArrayList<>();

            for (FoundReport found : candidates) {
                String prompt = buildPrompt(lost, found);
                String aiResponse = geminiService.generateContent(prompt);
                
                if (aiResponse != null) {
                    try {
                        // Parse simplified AI response
                        // Expected format: "Score: [0-100]\nReasoning: [Text]"
                        int score = parseScore(aiResponse);
                        String reasoning = parseReasoning(aiResponse);

                        if (score >= 50) { // Only suggest likely matches
                            matches.add(AIMatchResponse.MatchDetail.builder()
                                    .foundReportId(found.getId())
                                    .foundReportTitle(found.getTitle())
                                    .matchScore(score)
                                    .reasoning(reasoning)
                                    .category(found.getCategory())
                                    .foundLocation(found.getLocationName())
                                    .foundDescription(found.getDescription())
                                    .build());
                        }
                    } catch (Exception e) {
                        log.error("Failed to parse AI response for match {} - {}: {}", lost.getId(), found.getId(), e.getMessage());
                    }
                }
            }

            if (!matches.isEmpty()) {
                allSuggestions.add(AIMatchResponse.builder()
                        .lostReportId(lost.getId())
                        .lostReportTitle(lost.getTitle())
                        .matches(matches.stream()
                                .sorted((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()))
                                .collect(Collectors.toList()))
                        .build());
            }
        }

        return allSuggestions;
    }

    private String buildPrompt(LostReport lost, FoundReport found) {
        return String.format(
            "Act as a medieval treasure tracker. Compare these two reports and determine if they describe the same item.\n\n" +
            "LOST ITEM:\nTitle: %s\nCategory: %s\nDescription: %s\nColor: %s\nBrand: %s\n\n" +
            "FOUND ITEM:\nTitle: %s\nCategory: %s\nDescription: %s\nColor: %s\nBrand: %s\n\n" +
            "Provide your analysis in EXACTLY this format:\n" +
            "Score: [0-100]\n" +
            "Reasoning: [1-2 sentences in a medieval/fantasy tone explaining the match]",
            lost.getTitle(), lost.getCategory(), lost.getDescription(), lost.getColor(), lost.getBrand(),
            found.getTitle(), found.getCategory(), found.getDescription(), found.getColor(), found.getBrand()
        );
    }

    private int parseScore(String text) {
        try {
            String scoreLine = text.lines().filter(l -> l.toLowerCase().startsWith("score:")).findFirst().orElse("");
            return Integer.parseInt(scoreLine.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 0;
        }
    }

    private String parseReasoning(String text) {
        return text.lines()
                .filter(l -> l.toLowerCase().startsWith("reasoning:"))
                .findFirst()
                .map(l -> l.substring(l.indexOf(":") + 1).trim())
                .orElse("The mystical scrolls suggest a possible alignment between these artifacts.");
    }
}
