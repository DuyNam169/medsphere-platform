// ============================================================
// AiMessageList.tsx — src/packages/ai/components/AiMessageList.tsx
// Danh sách tin nhắn + welcome state + chỉ báo "AI đang trả lời".
// ============================================================
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';
import AiMessageBubble, { Message } from './AiMessageBubble';

interface AiMessageListProps {
  messages: Message[];
  isThinking: boolean;
  onSuggestClick: (text: string) => void;
  onFeedback?: (messageId: string, feedback: 'up' | 'down') => void;
  onCreateNewChat?: (question: string) => void;
  onViewDetails?: (message: Message) => void;
}

const AiMessageList: React.FC<AiMessageListProps> = ({
  messages,
  isThinking,
  onSuggestClick,
  onFeedback,
  onCreateNewChat,
  onViewDetails,
}) => {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const suggestPrompts = [
    { icon: t('ai.suggestIcon1'), text: t('ai.suggestPrompt1') },
    { icon: t('ai.suggestIcon2'), text: t('ai.suggestPrompt2') },
    { icon: t('ai.suggestIcon3'), text: t('ai.suggestPrompt3') },
    { icon: t('ai.suggestIcon4'), text: t('ai.suggestPrompt4') },
  ];

  return (
    <div className="ai-messages">
      <div className="ai-messages__inner">
        {messages.length === 0 && (
          <div className="ai-welcome">
            <div className="ai-welcome__avatar-ring">
              <SvgIcon name="IconAI" size={28} color="white" />
            </div>
            <h2 className="ai-welcome__title">{t('ai.welcomeTitle')}</h2>
            <p className="ai-welcome__subtitle">{t('ai.welcomeSubtitle')}</p>

            <div className="ai-suggestions">
              {suggestPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestClick(prompt.text)}
                  className="ai-suggestion-card"
                >
                  <span className="ai-suggestion-card__icon">{prompt.icon}</span>
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <AiMessageBubble
            key={msg.id}
            message={msg}
            onFeedback={onFeedback}
            onCreateNewChat={onCreateNewChat}
            onViewDetails={onViewDetails}
          />
        ))}

        {isThinking && (
          <div className="ai-bubble-row">
            <div className="ai-bubble-avatar">
              <SvgIcon name="IconAI" size={15} color="white" />
            </div>
            <div className="ai-bubble-col">
              <span className="ai-bubble-name">{t('ai.assistantName')}</span>
              <div className="ai-bubble ai-bubble--assistant ai-typing-bubble">
                <span className="ai-typing-dot" />
                <span className="ai-typing-dot" />
                <span className="ai-typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default AiMessageList;