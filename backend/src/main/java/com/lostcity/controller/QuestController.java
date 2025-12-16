package com.lostcity.controller;

import com.lostcity.dto.response.ApiResponse;
import com.lostcity.dto.response.QuestResponse;
import com.lostcity.service.QuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/quests")
@RequiredArgsConstructor
public class QuestController {

    private final QuestService questService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuestResponse>>> getQuests(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<QuestResponse> responsePage = questService.getQuests(status, page, pageSize);

        ApiResponse.MetaData meta = ApiResponse.MetaData.builder()
                .page(page)
                .pageSize(pageSize)
                .total(responsePage.getTotalElements())
                .build();

        return ResponseEntity.ok(ApiResponse.success(responsePage.getContent(), meta));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<ApiResponse<QuestResponse>> startQuest(@PathVariable UUID id) {
        QuestResponse response = questService.startQuest(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<QuestResponse>> completeQuest(@PathVariable UUID id) {
        QuestResponse response = questService.completeQuest(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
