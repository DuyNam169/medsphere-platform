package com.medsphere.modules.ai.service;

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

        // Lịch sử hội thoại TRƯỚC khi thêm tin nhắn mới này — dùng làm "history"
        // gửi cho ai-service, để tin nhắn hiện tại không bị lặp lại 2 lần.
        List<ChatDtos.AiHistoryItem> history = conversation.getMessages().stream()
                .map(m -> ChatDtos.AiHistoryItem.builder()
                        .role(m.getRole().name().toLowerCase())
                        .content(m.getContent())
                        .build())
                .toList();

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

        // 2) Gọi ai-service
        ChatDtos.AiChatResponse aiResponse = callAiService(request.getMessage(), history, conversation.getLockedSpecialty());

        // 3) Nếu đây là câu trả lời hợp lệ đầu tiên (chưa mismatch) và conversation
        // chưa có lockedSpecialty -> khóa lại theo chuyên khoa đầu tiên AI đề xuất.
        if (!aiResponse.isTopicMismatch()
                && conversation.getLockedSpecialty() == null
                && aiResponse.getSuggestedSpecialties() != null
                && !aiResponse.getSuggestedSpecialties().isEmpty()) {
            conversation.setLockedSpecialty(aiResponse.getSuggestedSpecialties().get(0));
        }

        // 4) Lưu tin nhắn assistant (kể cả khi là câu từ chối do khác chủ đề,
        // để lịch sử chat vẫn phản ánh đúng những gì đã hiển thị cho user)
        ChatMessage assistantMessage = ChatMessage.builder()
                .conversation(conversation)
                .role(MessageRole.ASSISTANT)
                .content(aiResponse.getReply())
                .build();
        assistantMessage = chatMessageRepository.save(assistantMessage);

        conversationRepository.save(conversation); // cập nhật updatedAt + lockedSpecialty + title

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
            String message, List<ChatDtos.AiHistoryItem> history, String lockedSpecialty) {

        ChatDtos.AiChatRequest requestBody = ChatDtos.AiChatRequest.builder()
                .message(message)
                .history(history)
                .lockedSpecialty(lockedSpecialty)
                .build();

        try {
            ChatDtos.AiChatResponse response = aiServiceRestTemplate.postForObject(
                    aiServiceUrl + "/api/ai/chat", requestBody, ChatDtos.AiChatResponse.class);

            if (response == null) {
                throw new IllegalStateException("ai-service trả về response rỗng");
            }
            return response;
        } catch (Exception ex) {
            // Không bao giờ để lỗi gọi ai-service làm sập cả request — trả về
            // câu xin lỗi giống cách ai-service tự xử lý lỗi nội bộ của nó.
            log.error("Lỗi khi gọi ai-service: {}", ex.getMessage(), ex);
            ChatDtos.AiChatResponse fallback = new ChatDtos.AiChatResponse();
            fallback.setReply("Xin lỗi, hệ thống AI đang gặp sự cố. Bạn vui lòng thử lại sau ít phút.");
            fallback.setSuggestedSpecialties(Collections.emptyList());
            fallback.setSources(Collections.emptyList());
            fallback.setEmergency(false);
            fallback.setTopicMismatch(false);
            return fallback;
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
                .build();
    }
}