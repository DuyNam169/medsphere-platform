package com.medsphere.modules.ai.repository;

import com.medsphere.modules.ai.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    Optional<ChatMessage> findByIdAndConversationUserId(UUID id, UUID userId);
}