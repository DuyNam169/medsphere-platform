package com.medsphere.modules.ai.entity;

import com.medsphere.core.entity.BaseEntity;
import com.medsphere.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Conversation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 255)
    private String title;

    // Chuyên khoa đã "khóa" cho đoạn chat này — xác định từ suggestedSpecialties
    // của tin nhắn AI đầu tiên. Dùng để chặn các câu hỏi khác chủ đề trong cùng
    // 1 đoạn chat (xem ChatServiceImpl.chat()). Null nếu chưa có tin nhắn nào,
    // hoặc tin nhắn đầu tiên không xác định được chuyên khoa nào.
    @Column(name = "locked_specialty", length = 64)
    private String lockedSpecialty;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();
}