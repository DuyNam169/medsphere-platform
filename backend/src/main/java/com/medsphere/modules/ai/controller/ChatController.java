package com.medsphere.modules.ai.controller;

import com.medsphere.core.constants.AppConstants;
import com.medsphere.core.response.ApiResponse;
import com.medsphere.modules.ai.dto.ChatDtos;
import com.medsphere.modules.ai.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(AppConstants.AI_BASE)
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    public ApiResponse<List<ChatDtos.ConversationSummary>> listConversations(
            @AuthenticationPrincipal String userId) {
        return ApiResponse.success(chatService.listConversations(UUID.fromString(userId)));
    }

    @PostMapping("/conversations")
    public ApiResponse<ChatDtos.ConversationDetail> createConversation(
            @AuthenticationPrincipal String userId,
            @RequestBody(required = false) ChatDtos.CreateConversationRequest request) {
        return ApiResponse.success(chatService.createConversation(UUID.fromString(userId), request));
    }

    @GetMapping("/conversations/{conversationId}")
    public ApiResponse<ChatDtos.ConversationDetail> getConversation(
            @AuthenticationPrincipal String userId,
            @PathVariable UUID conversationId) {
        return ApiResponse.success(chatService.getConversation(UUID.fromString(userId), conversationId));
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ApiResponse<ChatDtos.MessageResponse> addMessage(
            @AuthenticationPrincipal String userId,
            @PathVariable UUID conversationId,
            @Valid @RequestBody ChatDtos.SendMessageRequest request) {
        return ApiResponse.success(chatService.addMessage(UUID.fromString(userId), conversationId, request));
    }

    @PatchMapping("/messages/{messageId}/feedback")
    public ApiResponse<ChatDtos.MessageResponse> setFeedback(
            @AuthenticationPrincipal String userId,
            @PathVariable UUID messageId,
            @Valid @RequestBody ChatDtos.FeedbackRequest request) {
        return ApiResponse.success(chatService.setFeedback(UUID.fromString(userId), messageId, request));
    }

    @DeleteMapping("/conversations/{conversationId}")
    public ApiResponse<Void> deleteConversation(
            @AuthenticationPrincipal String userId,
            @PathVariable UUID conversationId) {
        chatService.deleteConversation(UUID.fromString(userId), conversationId);
        return ApiResponse.success();
    }
}