// ============================================================
// AiPage.tsx — src/packages/ai/pages/AiPage.tsx
// ============================================================
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/authStore';
import AiSidebar from '../components/AiSidebar';
import AiChatHeader from '../components/AiChatHeader';
import AiMessageList from '../components/AiMessageList';
import AiInputBar from '../components/AiInputBar';
import AiDetailPanel, { DetailPanelData } from '../components/AiDetailPanel';
import { Message } from '../components/AiMessageBubble';
import { chatService, ConversationSummary } from '../services/chatService';
import '../styles/ai.css';
import { Attachment } from '../components/AiInputBar';

// Giới hạn chiều rộng khung chi tiết khi kéo thả
const DETAIL_PANEL_MIN_WIDTH = 320;
const DETAIL_PANEL_MAX_RATIO = 0.85; // tối đa 85% chiều rộng màn hình

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

  // Khung chi tiết bên phải — mặc định mở ra chiếm nửa màn hình, kéo thả tự do
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [detailPanelWidth, setDetailPanelWidth] = useState<number>(
    Math.round(window.innerWidth / 2)
  );
  const [detailPanelData, setDetailPanelData] = useState<DetailPanelData | null>(null);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(0);

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

  // ── Kéo thả để thay đổi kích thước khung chi tiết ──────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      // Panel nằm bên phải, kéo thanh sang trái (clientX giảm) -> panel rộng ra
      const delta = dragStartXRef.current - e.clientX;
      const maxWidth = Math.round(window.innerWidth * DETAIL_PANEL_MAX_RATIO);
      const nextWidth = Math.min(
        maxWidth,
        Math.max(DETAIL_PANEL_MIN_WIDTH, dragStartWidthRef.current + delta)
      );
      setDetailPanelWidth(nextWidth);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleStartResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = detailPanelWidth;
    document.body.style.userSelect = 'none'; // tránh bôi đen chữ khi kéo
    document.body.style.cursor = 'col-resize';
  };

  const handleNewChat = () => {
    if (!isAuthenticated) return requireLogin();
    setMessages([]);
    setActiveConvId(null);
    setDetailPanelOpen(false);
    setDetailPanelData(null);
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
      setDetailPanelOpen(false);
      setDetailPanelData(null);
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

  const openDetailPanelFor = (msg: Message) => {
    setDetailPanelData({
      sources: msg.sources,
      suggestedSpecialties: msg.suggestedSpecialties,
      emergency: msg.emergency,
      topicMismatch: msg.topicMismatch,
    });
    // Mỗi lần mở lại (kể cả đã đóng trước đó) đều về mặc định nửa màn hình,
    // để không bị "kẹt" ở kích thước rất nhỏ nếu lần trước kéo lỡ tay.
    setDetailPanelWidth(Math.round(window.innerWidth / 2));
    setDetailPanelOpen(true);
  };

  /**
   * Gửi 1 câu hỏi vào 1 conversation cụ thể đã tồn tại trên backend.
   * Dùng chung cho cả "gửi tin nhắn bình thường" và "tạo chat mới từ nút
   * khi bị chặn khác chủ đề" — để không lặp lại logic 2 nơi.
   */
  const performSend = async (conversationId: string, userContent: string) => {
    const optimisticId = `local-${Date.now()}`;
    const userMsg: Message = {
      id: optimisticId,
      role: 'user',
      content: userContent,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const result = await chatService.chat(conversationId, userContent);

      const assistantMsg: Message = {
        id: result.assistantMessage.id,
        role: 'assistant',
        content: result.assistantMessage.content,
        timestamp: new Date(result.assistantMessage.createdAt),
        sources: result.sources,
        suggestedSpecialties: result.suggestedSpecialties,
        emergency: result.emergency,
        topicMismatch: result.topicMismatch,
        mismatchOriginalMessage: result.topicMismatch ? userContent : undefined,
      };

      setMessages((prev) => {
        const withRealUserId = prev.map((m) =>
          m.id === optimisticId
            ? {
                ...m,
                id: result.userMessage.id,
                timestamp: new Date(result.userMessage.createdAt),
              }
            : m
        );
        return [...withRealUserId, assistantMsg];
      });

      // Tự động mở khung chi tiết (chiếm nửa màn hình) nếu có thông tin đáng hiển thị
      const hasDetails =
        (result.sources && result.sources.length > 0) ||
        (result.suggestedSpecialties && result.suggestedSpecialties.length > 0);
      if (hasDetails) {
        openDetailPanelFor(assistantMsg);
      }

      touchConversationInList(conversationId, userContent.slice(0, 60));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: t('ai.errorReply'),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isThinking) return;
    if (!isAuthenticated) return requireLogin();

    const userContent = inputValue.trim();
    setInputValue('');

    let conversationId = activeConvId;

    if (!conversationId) {
      try {
        const created = await chatService.createConversation();
        conversationId = created.id;
        setActiveConvId(conversationId);
        touchConversationInList(conversationId, null);
      } catch {
        return;
      }
    }

    await performSend(conversationId, userContent);
  };

  const handleCreateNewChatWithQuestion = async (question: string) => {
    if (!question.trim()) return;
    if (!isAuthenticated) return requireLogin();

    try {
      const created = await chatService.createConversation();
      setActiveConvId(created.id);
      setMessages([]);
      setDetailPanelOpen(false);
      setDetailPanelData(null);
      touchConversationInList(created.id, null);
      await performSend(created.id, question);
    } catch {
      // Không tạo được hội thoại mới — bỏ qua, người dùng có thể thử lại
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
            onCreateNewChat={handleCreateNewChatWithQuestion}
            onViewDetails={openDetailPanelFor}
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

        <AiDetailPanel
          isOpen={detailPanelOpen}
          widthPx={detailPanelWidth}
          data={detailPanelData}
          onClose={() => setDetailPanelOpen(false)}
          onStartResize={handleStartResize}
        />
      </div>
    </div>
  );
};

export default AiPage;