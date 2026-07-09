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

export interface SourceItem {
  title: string;
  url: string;
}

// Mirror app.shared.schemas.StructuredSummary bên ai-service.
export type EmergencyLevel = 'NORMAL' | 'MONITOR' | 'SEE_DOCTOR_SOON' | 'EMERGENCY';

export interface StructuredSummary {
  quickSummary: string;
  emergencyLevel: EmergencyLevel;
  symptoms: string[];
  commonCauses: string[];
  rareCauses: string[];
  seriousCauses: string[];
  consequences: string;
  selfCareActions: string[];
  whenToSeeDoctor: string[];
}

export interface ChatMessageResponse {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  feedback: 'up' | 'down' | null;
  createdAt: string;
  // Metadata AI đã lưu — chỉ có giá trị thật với tin nhắn role="assistant".
  // Nhờ backend lưu lại (không phải chỉ trả về lúc chat xong), nên khi tải
  // lại đoạn chat cũ (F5, chuyển qua lại giữa các đoạn chat) vẫn còn đủ
  // dữ liệu để mở khung "Xem chi tiết".
  sources?: SourceItem[];
  suggestedSpecialties?: string[];
  emergency?: boolean;
  topicMismatch?: boolean;
  structuredSummary?: StructuredSummary | null;
}

export interface ConversationDetail {
  id: string;
  title: string | null;
  messages: ChatMessageResponse[];
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

  chat: (conversationId: string, message: string): Promise<ChatReplyResponse> =>
    apiService.post<ChatReplyResponse>(`${BASE}/conversations/${conversationId}/chat`, {
      message,
    }),

  setFeedback: (messageId: string, feedback: 'up' | 'down'): Promise<ChatMessageResponse> =>
    apiService.patch<ChatMessageResponse>(`${BASE}/messages/${messageId}/feedback`, { feedback }),

  deleteConversation: (id: string): Promise<void> =>
    apiService.delete<void>(`${BASE}/conversations/${id}`),
};