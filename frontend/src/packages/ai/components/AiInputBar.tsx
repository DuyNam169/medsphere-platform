// ============================================================
// AiInputBar.tsx — src/modules/ai/components/AiInputBar.tsx
// Input area ghim cố định phía dưới vùng chat
// ============================================================
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';

interface AiInputBarProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onRequireLogin: () => void;
}

const AiInputBar: React.FC<AiInputBarProps> = ({ value, onChange, onSend, onRequireLogin }) => {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea theo nội dung, tối đa 200px
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = value.trim().length > 0;

  return (
    // flex-shrink-0 đảm bảo input KHÔNG bị co lại khi messages area tràn
    <div className="flex-shrink-0 border-t border-fb-border bg-fb-bg-card px-4 py-3">
      {/* Disclaimer */}
      <p className="text-[11px] text-fb-text-secondary text-center mb-2">
        {t('ai.disclaimer')}
      </p>

      {/* Input box */}
      <div className="flex items-end gap-2 bg-fb-bg-input rounded-2xl px-4 py-3 border border-fb-border focus-within:border-fb-primary transition-colors">
        {/* Attach — cần đăng nhập */}
        <button
          onClick={onRequireLogin}
          className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-fb-bg-hover-dark flex items-center justify-center text-fb-text-secondary transition-colors mb-0.5"
          title={t('ai.attachFileLockedTooltip')}
        >
          <SvgIcon name="IconAttach" size={20} color="currentColor" />
        </button>

        {/* Textarea auto-resize */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('ai.inputPlaceholder')}
          rows={1}
          className="flex-1 bg-transparent text-fb-text placeholder-fb-text-secondary text-sm resize-none outline-none leading-relaxed"
          style={{ maxHeight: 200 }}
        />

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={!canSend}
          className={`
            flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all mb-0.5
            ${canSend
              ? 'bg-fb-primary hover:bg-fb-primary-hover cursor-pointer'
              : 'bg-fb-bg-hover-dark cursor-default'
            }
          `}
          title={t('ai.send')}
        >
          <SvgIcon
            name="IconSend"
            size={18}
            color={canSend ? 'white' : '#65676B'}
          />
        </button>
      </div>
    </div>
  );
};

export default AiInputBar;