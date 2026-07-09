package com.medsphere.modules.ai.entity;

import com.medsphere.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MessageRole role;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private MessageFeedback feedback;

    // ── Metadata AI (chỉ có giá trị với tin nhắn role=ASSISTANT) ──
    // Lưu dạng JSON string thô (serialize/deserialize ở ChatServiceImpl)
    // để không phải tạo thêm bảng riêng cho 1 danh sách nhỏ như thế này.

    @Column(name = "sources_json", columnDefinition = "TEXT")
    private String sourcesJson;

    @Column(name = "suggested_specialties_json", columnDefinition = "TEXT")
    private String suggestedSpecialtiesJson;

    @Column(nullable = false)
    @Builder.Default
    private boolean emergency = false;

    @Column(name = "topic_mismatch", nullable = false)
    @Builder.Default
    private boolean topicMismatch = false;

    // Bảng tổng hợp trực quan (triệu chứng/nguyên nhân/hậu quả/biện pháp...)
    // cho AiDetailPanel — cùng cơ chế lưu JSON thô như 2 field phía trên.
    @Column(name = "structured_summary_json", columnDefinition = "TEXT")
    private String structuredSummaryJson;
}