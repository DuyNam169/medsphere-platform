// ============================================================
// chatService.ts — src/packages/ai/services/chatService.ts
// Gọi API lưu trữ hội thoại AI ở backend Spring Boot.
// Từ nay MỌI tin nhắn AI đều đi qua backend (FE -> BE -> ai-service),
// không còn gọi thẳng ai-service từ frontend nữa.
// ============================================================

import { apiService } from '../../../core/services/api';

const BASE = '/v1/ai';

export interface ConversationSummary {
  id: string;
  title: string | null;
  updatedAt: string;
}

export interface ChatMessageResponse {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  feedback: 'up' | 'down' | null;
  createdAt: string;
}

export interface ConversationDetail {
  id: string;
  title: string | null;
  messages: ChatMessageResponse[];
}

export interface SourceItem {
  title: string;
  url: string;
}

export interface ChatReplyResponse {
  userMessage: ChatMessageResponse;
  assistantMessage: ChatMessageResponse;
  sources: SourceItem[];
  suggestedSpecialties: string[];
  emergency: boolean;
  topicMismatch: boolean;
}

export const chatService = {
  listConversations: (): Promise<ConversationSummary[]> =>
    apiService.get<ConversationSummary[]>(`${BASE}/conversations`),

  createConversation: (title?: string): Promise<ConversationDetail> =>
    apiService.post<ConversationDetail>(`${BASE}/conversations`, title ? { title } : {}),

  getConversation: (id: string): Promise<ConversationDetail> =>
    apiService.get<ConversationDetail>(`${BASE}/conversations/${id}`),

  // Gửi 1 câu hỏi vào 1 đoạn chat cụ thể — backend sẽ tự lưu tin nhắn user,
  // gọi ai-service, lưu tin nhắn assistant, và trả về đủ thông tin
  // (sources, topicMismatch...) trong 1 lần gọi duy nhất.
  chat: (conversationId: string, message: string): Promise<ChatReplyResponse> =>
    apiService.post<ChatReplyResponse>(`${BASE}/conversations/${conversationId}/chat`, {
      message,
    }),

  setFeedback: (messageId: string, feedback: 'up' | 'down'): Promise<ChatMessageResponse> =>
    apiService.patch<ChatMessageResponse>(`${BASE}/messages/${messageId}/feedback`, { feedback }),

  deleteConversation: (id: string): Promise<void> =>
    apiService.delete<void>(`${BASE}/conversations/${id}`),
};