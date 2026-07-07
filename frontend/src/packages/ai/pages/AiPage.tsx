// ============================================================
// AiPage.tsx — src/packages/ai/pages/AiPage.tsx
// ============================================================
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/authStore';
import AiSidebar from '../components/AiSidebar';
import AiChatHeader from '../components/AiChatHeader';
import AiMessageList from '../components/AiMessageList';
import AiInputBar from '../components/AiInputBar';
import { Message } from '../components/AiMessageBubble';
import { chatService, ConversationSummary } from '../services/chatService';
import '../styles/ai.css';
import { Attachment } from '../components/AiInputBar';

const AiPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  const requireLogin = () => navigate('/login');

  // Nạp danh sách hội thoại khi đăng nhập / đăng xuất
  useEffect(() => {
    if (!isAuthenticated) {
      setConversations([]);
      return;
    }
    setIsLoadingConversations(true);
    chatService
      .listConversations()
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setIsLoadingConversations(false));
  }, [isAuthenticated]);

  const handleNewChat = () => {
    if (!isAuthenticated) return requireLogin();
    setMessages([]);
    setActiveConvId(null);
  };

  const handleConvClick = async (id: string) => {
    if (!isAuthenticated) return requireLogin();
    try {
      const detail = await chatService.getConversation(id);
      setActiveConvId(detail.id);
      setMessages(
        detail.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.createdAt),
          feedback: m.feedback,
        }))
      );
    } catch {
      // Hội thoại không tồn tại hoặc không thuộc về user — bỏ qua, giữ nguyên UI hiện tại
    }
  };

  const touchConversationInList = (id: string, title: string | null) => {
    setConversations((prev) => {
      const exists = prev.some((c) => c.id === id);
      const now = new Date().toISOString();
      const next = exists
        ? prev.map((c) => (c.id === id ? { ...c, title: c.title ?? title, updatedAt: now } : c))
        : [{ id, title, updatedAt: now }, ...prev];
      return [...next].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isThinking) return;

    const userContent = inputValue.trim();
    let conversationId = activeConvId;

    // Tạo hội thoại mới trên backend nếu đây là tin nhắn đầu tiên và đã đăng nhập
    if (isAuthenticated && !conversationId) {
      try {
        const created = await chatService.createConversation();
        conversationId = created.id;
        setActiveConvId(conversationId);
        touchConversationInList(conversationId, null);
      } catch {
        // Nếu tạo hội thoại thất bại, vẫn tiếp tục chat ở chế độ không lưu trữ
      }
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    // Lưu tin nhắn user vào backend (không chặn nếu lỗi)
    if (isAuthenticated && conversationId) {
      try {
        const saved = await chatService.sendMessage(conversationId, 'user', userContent);
        userMsg.id = saved.id;
        setMessages((prev) => prev.map((m) => (m === userMsg ? { ...m, id: saved.id } : m)));
        touchConversationInList(conversationId, userContent.slice(0, 60));
      } catch {
        // bỏ qua, tin nhắn vẫn hiển thị local
      }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_AI_SERVICE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userContent,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('AI service error');
      const data = await response.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      if (isAuthenticated && conversationId) {
        try {
          const saved = await chatService.sendMessage(conversationId, 'assistant', data.reply);
          aiMsg.id = saved.id;
          touchConversationInList(conversationId, null);
        } catch {
          // bỏ qua, tin nhắn vẫn hiển thị local
        }
      }

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('ai.errorReply'),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback } : m))
    );
    if (isAuthenticated) {
      chatService.setFeedback(messageId, feedback).catch(() => {
        // Không chặn UI nếu lưu feedback thất bại
      });
    }
  };

  const handleSuggestClick = (text: string) => {
    setInputValue(text);
  };

  const handlePickFiles = (files: FileList) => {
    const next: Attachment[] = Array.from(files).map((file) => {
      const isImage = file.type.startsWith('image/');
      return {
        id: crypto.randomUUID(),
        kind: isImage ? 'image' : 'file',
        name: file.name,
        size: file.size,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      };
    });
    setAttachments((prev) => [...prev, ...next]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handlePasteLongText = (text: string) => {
    setAttachments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        kind: 'text',
        name: t('ai.pastedTextName'),
        size: text.length,
      },
    ]);
  };

  return (
    <div className="ai-page">
      <header className="ai-topbar">
        <Link to="/" className="ai-topbar__brand">
          <img src="/logo.svg" alt="" />
          <span>Medsphere</span>
        </Link>
        <Link to="/" className="ai-topbar__home-link">
          {t('ai.backToHome')}
        </Link>
      </header>

      <div className="ai-layout">
        <AiSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeConvId={activeConvId}
          onConvClick={handleConvClick}
          onRequireLogin={requireLogin}
          onNewChat={handleNewChat}
          isAuthenticated={isAuthenticated}
          conversations={conversations}
          isLoadingConversations={isLoadingConversations}
        />

        <main className="ai-main">
          <AiChatHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            onRequireLogin={requireLogin}
            isAuthenticated={isAuthenticated}
          />

          <AiMessageList
            messages={messages}
            isThinking={isThinking}
            onSuggestClick={handleSuggestClick}
            onFeedback={handleFeedback}
          />

          <AiInputBar
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            onRequireLogin={requireLogin}
            isSending={isThinking}
            attachments={attachments}
            onPickFiles={handlePickFiles}
            onRemoveAttachment={handleRemoveAttachment}
            onPasteLongText={handlePasteLongText}
          />
        </main>
      </div>
    </div>
  );
};

export default AiPage;