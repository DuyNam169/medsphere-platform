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

    // Chuyên khoa đã "khóa" cho đoạn chat này — xem ChatServiceImpl.chat().
    @Column(name = "locked_specialty", length = 64)
    private String lockedSpecialty;

    // Danh sách triệu chứng đã biết (JSON array of string), tích lũy dần
    // qua các lượt hỏi trong cùng đoạn chat. Dùng để ai-service so sánh
    // xem câu hỏi mới có triệu chứng nào MỚI không.
    @Column(name = "known_symptoms_json", columnDefinition = "TEXT")
    private String knownSymptomsJson;

    // Context (link + nội dung) đã lấy được ở lần tìm kiếm gần nhất (JSON
    // array of {title, url, content}). Được tái sử dụng khi không có triệu
    // chứng mới, tránh gọi lại Tavily không cần thiết.
    @Column(name = "cached_context_json", columnDefinition = "TEXT")
    private String cachedContextJson;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();
}