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

    // ── Luồng chat qua backend (FE -> BE -> ai-service) ──────────

    /** Request từ frontend: chỉ cần gửi nội dung câu hỏi. */
    @Data
    public static class SendChatMessageRequest {
        @NotBlank
        private String message;
    }

    @Data
    @Builder
    public static class SourceItem {
        private String title;
        private String url;
    }

    /**
     * Response trả về cho frontend sau 1 lượt hỏi-đáp: gồm tin nhắn user và
     * tin nhắn assistant đã được lưu, cộng thêm metadata riêng của lượt trả
     * lời này (sources, suggestedSpecialties, emergency, topicMismatch).
     * Metadata này KHÔNG được lưu lại trong DB, chỉ trả về ngay lúc đó.
     */
    @Data
    @Builder
    public static class ChatReplyResponse {
        private MessageResponse userMessage;
        private MessageResponse assistantMessage;
        private List<SourceItem> sources;
        private List<String> suggestedSpecialties;
        private boolean emergency;
        private boolean topicMismatch;
    }

    // ── DTO nội bộ để gọi sang ai-service (không lộ ra ngoài controller) ──

    @Data
    @Builder
    public static class AiHistoryItem {
        private String role;
        private String content;
    }

    @Data
    @Builder
    public static class AiChatRequest {
        private String message;
        private List<AiHistoryItem> history;
        private String lockedSpecialty;
    }

    @Data
    public static class AiChatResponse {
        private String reply;
        private List<String> suggestedSpecialties;
        private List<SourceItem> sources;
        private boolean emergency;
        private boolean topicMismatch;
    }
}