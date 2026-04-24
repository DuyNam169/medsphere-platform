// ============================================================
// AiMessageBubble.tsx — src/modules/ai/components/AiMessageBubble.tsx
// Từng bubble tin nhắn: user (navy) hoặc AI (gray bg)
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AiMessageBubbleProps {
  message: Message;
}

// Render markdown đơn giản: **bold**, - bullet, 1. numbered, \n line break
const renderContent = (content: string): React.ReactNode[] => {
  return content.split('\n').map((line, i) => {
    // Xử lý bold **text**
    const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );

    if (line.startsWith('- ')) {
      return (
        <p key={i} className="ml-4">
          {'• '}
          {line.slice(2).split(/\*\*(.*?)\*\*/g).map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </p>
      );
    }
    if (/^\d+\.\s/.test(line)) {
      return (
        <p key={i} className="ml-4">
          {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
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

const AiMessageBubble: React.FC<AiMessageBubbleProps> = ({ message }) => {
  const { t } = useTranslation();
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* AI avatar — chỉ hiện với tin AI */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-fb-primary flex items-center justify-center flex-shrink-0 mt-1">
          <SvgIcon name="IconAI" size={16} color="white" />
        </div>
      )}

      {/* Bubble + actions */}
      <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Tên người gửi */}
        {!isUser && (
          <span className="text-xs font-semibold text-fb-text-secondary px-1">
            {t('ai.assistantName')}
          </span>
        )}

        {/* Nội dung bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? 'bg-fb-primary text-white rounded-br-sm'
              : 'bg-fb-bg-page text-fb-text rounded-bl-sm border border-fb-border'
            }
          `}
        >
          <div className="space-y-1">
            {renderContent(message.content)}
          </div>
        </div>

        {/* Timestamp + actions */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-fb-text-secondary">{formatTime(message.timestamp)}</span>

          {/* Actions chỉ hiện với tin AI */}
          {!isUser && (
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => navigator.clipboard?.writeText(message.content)}
                className="w-6 h-6 rounded flex items-center justify-center text-fb-text-secondary hover:text-fb-primary hover:bg-fb-bg-hover transition-colors"
                title={t('ai.copy')}
              >
                <SvgIcon name="IconCopy" size={12} color="currentColor" />
              </button>
              <button
                className="w-6 h-6 rounded flex items-center justify-center text-fb-text-secondary hover:text-green-600 hover:bg-fb-bg-hover transition-colors"
                title={t('ai.helpful')}
              >
                <SvgIcon name="IconThumbUp" size={12} color="currentColor" />
              </button>
              <button
                className="w-6 h-6 rounded flex items-center justify-center text-fb-text-secondary hover:text-red-500 hover:bg-fb-bg-hover transition-colors"
                title={t('ai.notHelpful')}
              >
                <SvgIcon name="IconThumbDown" size={12} color="currentColor" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User avatar — chỉ hiện với tin user */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-fb-bg-hover-dark flex items-center justify-center flex-shrink-0 mt-1">
          <SvgIcon name="IconUser" size={18} color="currentColor" className="text-fb-text-secondary" />
        </div>
      )}
    </div>
  );
};

export default AiMessageBubble;