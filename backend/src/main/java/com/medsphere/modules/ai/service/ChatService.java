package com.medsphere.modules.ai.service;

import com.medsphere.modules.ai.dto.ChatDtos;

import java.util.List;
import java.util.UUID;

public interface ChatService {

    List<ChatDtos.ConversationSummary> listConversations(UUID userId);

    ChatDtos.ConversationDetail createConversation(UUID userId, ChatDtos.CreateConversationRequest request);

    ChatDtos.ConversationDetail getConversation(UUID userId, UUID conversationId);

    ChatDtos.MessageResponse addMessage(UUID userId, UUID conversationId, ChatDtos.SendMessageRequest request);

    ChatDtos.MessageResponse setFeedback(UUID userId, UUID messageId, ChatDtos.FeedbackRequest request);

    void deleteConversation(UUID userId, UUID conversationId);

    // Luồng chat chuẩn: BE lưu tin nhắn user, gọi ai-service, lưu tin nhắn
    // assistant, cập nhật lockedSpecialty nếu cần, trả về đủ thông tin cho FE.
    ChatDtos.ChatReplyResponse chat(UUID userId, UUID conversationId, ChatDtos.SendChatMessageRequest request);
}