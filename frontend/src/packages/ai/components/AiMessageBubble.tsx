// ============================================================
// AiMessageBubble.tsx — src/packages/ai/components/AiMessageBubble.tsx
// Bong bóng tin nhắn — dùng bảng màu Medsphere (navy/trắng).
// ============================================================
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';
import { useToastStore } from '../../../core/store/toastStore';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'up' | 'down' | null;
}

interface AiMessageBubbleProps {
  message: Message;
  onFeedback?: (messageId: string, feedback: 'up' | 'down') => void;
}

const renderContent = (content: string): React.ReactNode[] => {
  return content.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );

    if (line.startsWith('- ')) {
      return (
        <p key={i}>
          {'• '}
          {line.slice(2).split(/\*\*(.*?)\*\*/g).map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </p>
      );
    }
    if (line === '') return <br key={i} />;
    return <p key={i}>{parts}</p>;
  });
};

const formatTime = (date: Date): string =>
  date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

const AiMessageBubble: React.FC<AiMessageBubbleProps> = ({ message, onFeedback }) => {
  const { t } = useTranslation();
  const showToast = useToastStore((s) => s.show);
  const isUser = message.role === 'user';
  const [localFeedback, setLocalFeedback] = useState<'up' | 'down' | null>(message.feedback ?? null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      showToast(t('ai.copiedToast'), 'success');
    } catch {
      showToast(t('ai.copyFailedToast'), 'error');
    }
  };

  const handleFeedback = (value: 'up' | 'down') => {
    if (localFeedback === value) return; // đã chọn rồi, không lặp lại
    setLocalFeedback(value);
    onFeedback?.(message.id, value);
    showToast(
      value === 'up' ? t('ai.feedbackHelpfulToast') : t('ai.feedbackNotHelpfulToast'),
      'success'
    );
  };

  return (
    <div className={`ai-bubble-row ${isUser ? 'ai-bubble-row--user' : ''}`}>
      {!isUser && (
        <div className="ai-bubble-avatar">
          <SvgIcon name="IconAI" size={15} color="white" />
        </div>
      )}

      <div className={`ai-bubble-col ${isUser ? 'ai-bubble-col--user' : ''}`}>
        {!isUser && <span className="ai-bubble-name">{t('ai.assistantName')}</span>}

        <div className={`ai-bubble ${isUser ? 'ai-bubble--user' : 'ai-bubble--assistant'}`}>
          {renderContent(message.content)}
        </div>

        <div className={`ai-bubble-meta ${isUser ? 'ai-bubble-meta--user' : ''}`}>
          <span className="ai-bubble-time">{formatTime(message.timestamp)}</span>

          {!isUser && (
            <div className="ai-bubble-actions">
              <button
                onClick={handleCopy}
                className="ai-bubble-action-btn"
                title={t('ai.copy')}
              >
                <SvgIcon name="IconCopy" size={12} color="currentColor" />
              </button>
              <button
                onClick={() => handleFeedback('up')}
                className="ai-bubble-action-btn"
                title={t('ai.helpful')}
                style={{ opacity: localFeedback === 'down' ? 0.35 : 1 }}
                disabled={localFeedback === 'down'}
              >
                <SvgIcon
                  name="IconThumbUp"
                  size={12}
                  color={localFeedback === 'up' ? '#0f6e56' : 'currentColor'}
                />
              </button>
              <button
                onClick={() => handleFeedback('down')}
                className="ai-bubble-action-btn"
                title={t('ai.notHelpful')}
                style={{ opacity: localFeedback === 'up' ? 0.35 : 1 }}
                disabled={localFeedback === 'up'}
              >
                <SvgIcon
                  name="IconThumbDown"
                  size={12}
                  color={localFeedback === 'down' ? '#993c1d' : 'currentColor'}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="ai-bubble-avatar ai-bubble-avatar--user">
          <SvgIcon name="IconUser" size={16} color="currentColor" />
        </div>
      )}
    </div>
  );
};

export default AiMessageBubble;