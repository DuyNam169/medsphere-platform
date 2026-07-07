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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private static final int AUTO_TITLE_MAX_LENGTH = 60;

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository  chatMessageRepository;
    private final UserRepository         userRepository;

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

        // Tự đặt tiêu đề hội thoại từ tin nhắn đầu tiên của user (nếu chưa có title)
        if (role == MessageRole.USER && (conversation.getTitle() == null || conversation.getTitle().isBlank())) {
            conversation.setTitle(truncateTitle(request.getContent()));
        }
        conversationRepository.save(conversation); // cập nhật updatedAt để sắp xếp "gần đây" đúng

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

    // ── Helpers ───────────────────────────────────────────────

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