// ============================================================
// AiMessageList.tsx — src/modules/ai/components/AiMessageList.tsx
// Danh sách tin nhắn + welcome state khi chưa có tin
// ============================================================
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';
import AiMessageBubble, { Message } from './AiMessageBubble';

interface AiMessageListProps {
  messages: Message[];
  onSuggestClick: (text: string) => void;
}

const AiMessageList: React.FC<AiMessageListProps> = ({ messages, onSuggestClick }) => {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll xuống cuối khi có tin mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestPrompts = [
    { icon: t('ai.suggestIcon1'), text: t('ai.suggestPrompt1') },
    { icon: t('ai.suggestIcon2'), text: t('ai.suggestPrompt2') },
    { icon: t('ai.suggestIcon3'), text: t('ai.suggestPrompt3') },
    { icon: t('ai.suggestIcon4'), text: t('ai.suggestPrompt4') },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {/* Welcome state — khi chưa có tin */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-fb-primary flex items-center justify-center mb-4">
            <SvgIcon name="IconAI" size={32} color="white" />
          </div>
          <h2 className="text-2xl font-bold text-fb-text mb-2">{t('ai.welcomeTitle')}</h2>
          <p className="text-fb-text-secondary max-w-sm text-sm">{t('ai.welcomeSubtitle')}</p>

          {/* Suggested prompts */}
          <div className="grid grid-cols-2 gap-2 mt-6 w-full max-w-md">
            {suggestPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => onSuggestClick(prompt.text)}
                className="text-left p-3 rounded-xl border border-fb-border hover:border-fb-primary hover:bg-fb-primary-light transition-all text-sm text-fb-text"
              >
                <span className="block text-base mb-1">{prompt.icon}</span>
                {prompt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Danh sách messages */}
      {messages.map((msg) => (
        <AiMessageBubble key={msg.id} message={msg} />
      ))}

      {/* Anchor để auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
};

export default AiMessageList;