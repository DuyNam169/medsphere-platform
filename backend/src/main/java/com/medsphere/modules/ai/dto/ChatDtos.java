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

        private List<SourceItem> sources;
        private List<String> suggestedSpecialties;
        private boolean emergency;
        private boolean topicMismatch;
        // Bảng tổng hợp trực quan cho AiDetailPanel — chỉ có giá trị thật
        // với tin nhắn role="assistant". Null nếu AI không tổng hợp được
        // (ví dụ topicMismatch=true) hoặc tin nhắn cũ trước khi có tính năng này.
        private StructuredSummary structuredSummary;
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
        private String role;

        @NotBlank
        private String content;
    }

    @Data
    public static class FeedbackRequest {
        @NotBlank
        private String feedback;
    }

    // ── Luồng chat qua backend (FE -> BE -> ai-service) ──────────

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
     * 1 đoạn nội dung đã lấy từ nguồn tin cậy — có thêm "content" so với
     * SourceItem, để cache lại và tái sử dụng khi không có triệu chứng mới
     * (xem Conversation.cachedContextJson).
     */
    @Data
    @Builder
    public static class ContextChunkItem {
        private String title;
        private String url;
        private String content;
    }

    /**
     * Bảng tổng hợp trực quan hiển thị ở AiDetailPanel (mirror
     * app.shared.schemas.StructuredSummary bên ai-service — GIỮ 2 BÊN
     * ĐỒNG BỘ, sửa bên này thì phải sửa bên Python và ngược lại).
     */
    @Data
    @Builder
    public static class StructuredSummary {
        private String quickSummary;
        private String emergencyLevel; // NORMAL | MONITOR | SEE_DOCTOR_SOON | EMERGENCY
        private List<String> symptoms;
        private List<String> commonCauses;
        private List<String> rareCauses;
        private List<String> seriousCauses;
        private String consequences;
        private List<String> selfCareActions;
        private List<String> whenToSeeDoctor;
    }

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
        private List<String> knownSymptoms;
        private List<ContextChunkItem> cachedContextChunks;
    }

    @Data
    public static class AiChatResponse {
        private String reply;
        private List<String> suggestedSpecialties;
        private List<SourceItem> sources;
        private boolean emergency;
        private boolean topicMismatch;
        private boolean hasNewSymptom;
        private List<String> updatedKnownSymptoms;
        private List<ContextChunkItem> contextChunksUsed;
        private StructuredSummary structuredSummary;
    }
}