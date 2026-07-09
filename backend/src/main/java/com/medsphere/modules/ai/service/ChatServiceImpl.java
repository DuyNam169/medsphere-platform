package com.medsphere.modules.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medsphere.core.exception.AppException;
import com.medsphere.core.exception.ErrorCode;
import com.medsphere.modules.ai.dto.ChatDtos;
import com.medsphere.modules.ai.entity.ChatMessage;
import com.medsphere.modules.ai.entity.Conversation;
import com.medsphere.modules.ai.entity.MessageFeedback;
import com.medsphere.modules.ai.entity.MessageRole;
import com.medsphere.modules.ai.repository.ChatMessageRepository;
import com.medsphere.modules.ai.repository.ConversationRepository;
import com.medsphere.modules.auth.entity.User;
import com.medsphere.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private static final int AUTO_TITLE_MAX_LENGTH = 60;

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository  chatMessageRepository;
    private final UserRepository         userRepository;
    private final RestTemplate           aiServiceRestTemplate;
    private final ObjectMapper           objectMapper;

    @Value("${app.ai-service-url}")
    private String aiServiceUrl;

    @Override
    @Transactional(readOnly = true)
    public List<ChatDtos.ConversationSummary> listConversations(UUID userId) {
        return conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId).stream()
                .map(this::toSummary)
                .toList();
    }

    @Override
    @Transactional
    public ChatDtos.ConversationDetail createConversation(UUID userId, ChatDtos.CreateConversationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Conversation conversation = Conversation.builder()
                .user(user)
                .title(request != null ? request.getTitle() : null)
                .build();
        conversation = conversationRepository.save(conversation);

        return toDetail(conversation);
    }

    @Override
    @Transactional(readOnly = true)
    public ChatDtos.ConversationDetail getConversation(UUID userId, UUID conversationId) {
        Conversation conversation = findOwnedConversation(userId, conversationId);
        return toDetail(conversation);
    }

    @Override
    @Transactional
    public ChatDtos.MessageResponse addMessage(
            UUID userId, UUID conversationId, ChatDtos.SendMessageRequest request) {

        Conversation conversation = findOwnedConversation(userId, conversationId);
        MessageRole role = parseRole(request.getRole());

        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .role(role)
                .content(request.getContent())
                .build();
        message = chatMessageRepository.save(message);

        if (role == MessageRole.USER && (conversation.getTitle() == null || conversation.getTitle().isBlank())) {
            conversation.setTitle(truncateTitle(request.getContent()));
        }
        conversationRepository.save(conversation);

        return toMessageResponse(message);
    }

    @Override
    @Transactional
    public ChatDtos.MessageResponse setFeedback(UUID userId, UUID messageId, ChatDtos.FeedbackRequest request) {
        ChatMessage message = chatMessageRepository.findByIdAndConversationUserId(messageId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        message.setFeedback(parseFeedback(request.getFeedback()));
        chatMessageRepository.save(message);

        return toMessageResponse(message);
    }

    @Override
    @Transactional
    public void deleteConversation(UUID userId, UUID conversationId) {
        Conversation conversation = findOwnedConversation(userId, conversationId);
        conversationRepository.delete(conversation);
    }

    @Override
    @Transactional
    public ChatDtos.ChatReplyResponse chat(
            UUID userId, UUID conversationId, ChatDtos.SendChatMessageRequest request) {

        Conversation conversation = findOwnedConversation(userId, conversationId);

        List<ChatDtos.AiHistoryItem> history = conversation.getMessages().stream()
                .map(m -> ChatDtos.AiHistoryItem.builder()
                        .role(m.getRole().name().toLowerCase())
                        .content(m.getContent())
                        .build())
                .toList();

        List<String> knownSymptoms = parseSymptoms(conversation.getKnownSymptomsJson());
        List<ChatDtos.ContextChunkItem> cachedContext = parseContextChunks(conversation.getCachedContextJson());

        // 1) Lưu tin nhắn user
        ChatMessage userMessage = ChatMessage.builder()
                .conversation(conversation)
                .role(MessageRole.USER)
                .content(request.getMessage())
                .build();
        userMessage = chatMessageRepository.save(userMessage);

        if (conversation.getTitle() == null || conversation.getTitle().isBlank()) {
            conversation.setTitle(truncateTitle(request.getMessage()));
        }

        // 2) Gọi ai-service, kèm known symptoms + cached context để nó tự
        // quyết định có cần tìm lại nguồn hay không.
        ChatDtos.AiChatResponse aiResponse = callAiService(
                request.getMessage(), history, conversation.getLockedSpecialty(), knownSymptoms, cachedContext);

        // 3) Khóa chủ đề nếu đây là lần đầu có kết quả hợp lệ
        if (!aiResponse.isTopicMismatch()
                && conversation.getLockedSpecialty() == null
                && aiResponse.getSuggestedSpecialties() != null
                && !aiResponse.getSuggestedSpecialties().isEmpty()) {
            conversation.setLockedSpecialty(aiResponse.getSuggestedSpecialties().get(0));
        }

        // 4) Cập nhật cache triệu chứng + context cho lần hỏi sau
        conversation.setKnownSymptomsJson(toJson(aiResponse.getUpdatedKnownSymptoms()));
        conversation.setCachedContextJson(toJson(aiResponse.getContextChunksUsed()));

        // 5) Lưu tin nhắn assistant kèm metadata hiển thị (sources, specialties,
        // structuredSummary...)
        ChatMessage assistantMessage = ChatMessage.builder()
                .conversation(conversation)
                .role(MessageRole.ASSISTANT)
                .content(aiResponse.getReply())
                .sourcesJson(toJson(aiResponse.getSources()))
                .suggestedSpecialtiesJson(toJson(aiResponse.getSuggestedSpecialties()))
                .emergency(aiResponse.isEmergency())
                .topicMismatch(aiResponse.isTopicMismatch())
                .structuredSummaryJson(toJson(aiResponse.getStructuredSummary()))
                .build();
        assistantMessage = chatMessageRepository.save(assistantMessage);

        conversationRepository.save(conversation);

        return ChatDtos.ChatReplyResponse.builder()
                .userMessage(toMessageResponse(userMessage))
                .assistantMessage(toMessageResponse(assistantMessage))
                .sources(aiResponse.getSources() != null ? aiResponse.getSources() : Collections.emptyList())
                .suggestedSpecialties(aiResponse.getSuggestedSpecialties() != null
                        ? aiResponse.getSuggestedSpecialties() : Collections.emptyList())
                .emergency(aiResponse.isEmergency())
                .topicMismatch(aiResponse.isTopicMismatch())
                .build();
    }

    // ── Helpers ───────────────────────────────────────────────

    private ChatDtos.AiChatResponse callAiService(
            String message,
            List<ChatDtos.AiHistoryItem> history,
            String lockedSpecialty,
            List<String> knownSymptoms,
            List<ChatDtos.ContextChunkItem> cachedContext) {

        ChatDtos.AiChatRequest requestBody = ChatDtos.AiChatRequest.builder()
                .message(message)
                .history(history)
                .lockedSpecialty(lockedSpecialty)
                .knownSymptoms(knownSymptoms)
                .cachedContextChunks(cachedContext)
                .build();

        try {
            ChatDtos.AiChatResponse response = aiServiceRestTemplate.postForObject(
                    aiServiceUrl + "/api/ai/chat", requestBody, ChatDtos.AiChatResponse.class);

            if (response == null) {
                throw new IllegalStateException("ai-service trả về response rỗng");
            }
            return response;
        } catch (Exception ex) {
            log.error("Lỗi khi gọi ai-service: {}", ex.getMessage(), ex);
            ChatDtos.AiChatResponse fallback = new ChatDtos.AiChatResponse();
            fallback.setReply("Xin lỗi, hệ thống AI đang gặp sự cố. Bạn vui lòng thử lại sau ít phút.");
            fallback.setSuggestedSpecialties(Collections.emptyList());
            fallback.setSources(Collections.emptyList());
            fallback.setEmergency(false);
            fallback.setTopicMismatch(false);
            fallback.setHasNewSymptom(false);
            fallback.setUpdatedKnownSymptoms(knownSymptoms);
            fallback.setContextChunksUsed(cachedContext);
            fallback.setStructuredSummary(null);
            return fallback;
        }
    }

    private String toJson(Object value) {
        if (value == null) return null;
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ex) {
            log.warn("Không serialize được sang JSON: {}", ex.getMessage());
            return null;
        }
    }

    private List<ChatDtos.SourceItem> parseSources(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<ChatDtos.SourceItem>>() {});
        } catch (Exception ex) {
            log.warn("Không đọc được sourcesJson đã lưu: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }

    private List<String> parseSpecialties(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception ex) {
            log.warn("Không đọc được suggestedSpecialtiesJson đã lưu: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }

    private List<String> parseSymptoms(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception ex) {
            log.warn("Không đọc được knownSymptomsJson đã lưu: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }

    private List<ChatDtos.ContextChunkItem> parseContextChunks(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<ChatDtos.ContextChunkItem>>() {});
        } catch (Exception ex) {
            log.warn("Không đọc được cachedContextJson đã lưu: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }

    private ChatDtos.StructuredSummary parseStructuredSummary(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, ChatDtos.StructuredSummary.class);
        } catch (Exception ex) {
            log.warn("Không đọc được structuredSummaryJson đã lưu: {}", ex.getMessage());
            return null;
        }
    }

    private Conversation findOwnedConversation(UUID userId, UUID conversationId) {
        return conversationRepository.findByIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private MessageRole parseRole(String raw) {
        try {
            return MessageRole.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new AppException(ErrorCode.VALIDATION_FAILED, "Invalid role: " + raw);
        }
    }

    private MessageFeedback parseFeedback(String raw) {
        try {
            return MessageFeedback.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new AppException(ErrorCode.VALIDATION_FAILED, "Invalid feedback: " + raw);
        }
    }

    private String truncateTitle(String content) {
        String trimmed = content.trim();
        return trimmed.length() <= AUTO_TITLE_MAX_LENGTH
                ? trimmed
                : trimmed.substring(0, AUTO_TITLE_MAX_LENGTH) + "...";
    }

    private ChatDtos.ConversationSummary toSummary(Conversation c) {
        return ChatDtos.ConversationSummary.builder()
                .id(c.getId())
                .title(c.getTitle())
                .updatedAt(c.getUpdatedAt())
                .build();
    }

    private ChatDtos.ConversationDetail toDetail(Conversation c) {
        return ChatDtos.ConversationDetail.builder()
                .id(c.getId())
                .title(c.getTitle())
                .messages(c.getMessages().stream().map(this::toMessageResponse).toList())
                .build();
    }

    private ChatDtos.MessageResponse toMessageResponse(ChatMessage m) {
        return ChatDtos.MessageResponse.builder()
                .id(m.getId())
                .role(m.getRole().name().toLowerCase())
                .content(m.getContent())
                .feedback(m.getFeedback() != null ? m.getFeedback().name().toLowerCase() : null)
                .createdAt(m.getCreatedAt())
                .sources(parseSources(m.getSourcesJson()))
                .suggestedSpecialties(parseSpecialties(m.getSuggestedSpecialtiesJson()))
                .emergency(m.isEmergency())
                .topicMismatch(m.isTopicMismatch())
                .structuredSummary(parseStructuredSummary(m.getStructuredSummaryJson()))
                .build();
    }
}