// ============================================================
// chatService.ts — src/packages/ai/services/chatService.ts
// Gọi API lưu trữ hội thoại AI ở backend Spring Boot.
// (Lưu ý: đây khác với ai-service/FastAPI — nơi tạo câu trả lời AI.
// Luồng: FE lưu tin nhắn qua đây, đồng thời gọi ai-service để lấy reply.)
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

export const chatService = {
  listConversations: (): Promise<ConversationSummary[]> =>
    apiService.get<ConversationSummary[]>(`${BASE}/conversations`),

  createConversation: (title?: string): Promise<ConversationDetail> =>
    apiService.post<ConversationDetail>(`${BASE}/conversations`, title ? { title } : {}),

  getConversation: (id: string): Promise<ConversationDetail> =>
    apiService.get<ConversationDetail>(`${BASE}/conversations/${id}`),

  sendMessage: (
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<ChatMessageResponse> =>
    apiService.post<ChatMessageResponse>(`${BASE}/conversations/${conversationId}/messages`, {
      role,
      content,
    }),

  setFeedback: (messageId: string, feedback: 'up' | 'down'): Promise<ChatMessageResponse> =>
    apiService.patch<ChatMessageResponse>(`${BASE}/messages/${messageId}/feedback`, { feedback }),

  deleteConversation: (id: string): Promise<void> =>
    apiService.delete<void>(`${BASE}/conversations/${id}`),
};