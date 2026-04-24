// ============================================================
// AiPage.tsx — src/modules/ai/pages/AiPage.tsx
// Layout ghép: NavBar + AiSidebar + AiChatHeader + AiMessageList + AiInputBar
// ============================================================
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NavBar from '../../home/components/NavBar';
import LoginModal from '../../home/components/LoginModal';
import AiSidebar from '../components/AiSidebar';
import AiChatHeader from '../components/AiChatHeader';
import AiMessageList from '../components/AiMessageList';
import AiInputBar from '../components/AiInputBar';
import { Message } from '../components/AiMessageBubble';

const AiPage: React.FC = () => {
  const { t } = useTranslation();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConvId, setActiveConvId] = useState('1');
  const [inputValue, setInputValue] = useState('');

  // Mock messages khởi tạo từ i18n keys
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('ai.mockWelcome'),
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: '2',
      role: 'user',
      content: t('ai.mockUserMsg'),
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '3',
      role: 'assistant',
      content: t('ai.mockAiReply'),
      timestamp: new Date(Date.now() - 30000),
    },
  ]);

  const requireLogin = () => setLoginModalOpen(true);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Mock AI reply sau 800ms
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('ai.mockDemoReply'),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const handleSuggestClick = (text: string) => {
    setInputValue(text);
  };

  return (
    <div className="min-h-screen bg-fb-bg-page flex flex-col">
      {/* NavBar — fixed top */}
      <NavBar onRequireLogin={requireLogin} />

      {/*
        height: 100vh với pt-14 → chiếm toàn màn hình, trừ navbar
        overflow-hidden → ngăn layout tràn ra ngoài
      */}
      <div className="flex overflow-hidden" style={{ height: '100vh', paddingTop: '56px' }}>

        {/* Sidebar trái */}
        <AiSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeConvId={activeConvId}
          onConvClick={setActiveConvId}
          onRequireLogin={requireLogin}
        />

        {/*
          Vùng chat chính — flex flex-col + overflow-hidden:
            AiChatHeader  → flex-shrink-0 (cố định trên cùng)
            AiMessageList → flex-1 overflow-y-auto (chỉ phần này scroll)
            AiInputBar    → flex-shrink-0 (ghim dưới cùng, không bao giờ mất)
        */}
        <main className="flex-1 flex flex-col overflow-hidden bg-fb-bg-card">
          <AiChatHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            onRequireLogin={requireLogin}
          />

          <AiMessageList
            messages={messages}
            onSuggestClick={handleSuggestClick}
          />

          <AiInputBar
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            onRequireLogin={requireLogin}
          />
        </main>
      </div>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
};

export default AiPage;