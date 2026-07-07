package com.medsphere.modules.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class ChatDtos {

    private ChatDtos() {}

    @Data
    @Builder
    public static class ConversationSummary {
        private UUID id;
        private String title;
        private Instant updatedAt;
    }

    @Data
    @Builder
    public static class MessageResponse {
        private UUID id;
        private String role;
        private String content;
        private String feedback;
        private Instant createdAt;
    }

    @Data
    @Builder
    public static class ConversationDetail {
        private UUID id;
        private String title;
        private List<MessageResponse> messages;
    }

    @Data
    public static class CreateConversationRequest {
        @Size(max = 255)
        private String title;
    }

    @Data
    public static class SendMessageRequest {
        @NotBlank
        private String role; // "user" hoặc "assistant"

        @NotBlank
        private String content;
    }

    @Data
    public static class FeedbackRequest {
        @NotBlank
        private String feedback; // "up" hoặc "down"
    }
}