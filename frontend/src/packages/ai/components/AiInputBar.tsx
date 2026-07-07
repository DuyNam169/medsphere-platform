// ============================================================
// AiInputBar.tsx — src/packages/ai/components/AiInputBar.tsx
// Ô nhập liệu + đính kèm file/ảnh + tự tách nội dung dán dài
// thành thẻ đính kèm (giống Claude.ai).
// ============================================================
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';

export interface Attachment {
  id: string;
  kind: 'image' | 'file' | 'text';
  name: string;
  previewUrl?: string;
  size?: number;
}

interface AiInputBarProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onRequireLogin: () => void;
  isSending: boolean;
  attachments: Attachment[];
  onPickFiles: (files: FileList) => void;
  onRemoveAttachment: (id: string) => void;
  onPasteLongText: (text: string) => void;
}

const PASTE_LENGTH_THRESHOLD = 600;
const PASTE_LINE_THRESHOLD = 12;

const formatSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const AiInputBar: React.FC<AiInputBarProps> = ({
  value,
  onChange,
  onSend,
  isSending,
  attachments,
  onPickFiles,
  onRemoveAttachment,
  onPasteLongText,
}) => {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = e.clipboardData.files;
    if (files && files.length > 0) {
      e.preventDefault();
      onPickFiles(files);
      return;
    }

    const text = e.clipboardData.getData('text');
    const isLong = text.length > PASTE_LENGTH_THRESHOLD || text.split('\n').length > PASTE_LINE_THRESHOLD;
    if (isLong) {
      e.preventDefault();
      onPasteLongText(text);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onPickFiles(e.target.files);
      e.target.value = ''; // reset để chọn lại cùng 1 file vẫn trigger onChange
    }
  };

  const hasAttachments = attachments.length > 0;
  const canSend = value.trim().length > 0 && !isSending && !hasAttachments;

  return (
    <div className="ai-input-bar">
      <div className="ai-input-bar__inner">
        <p className="ai-input-bar__disclaimer">{t('ai.disclaimer')}</p>

        {hasAttachments && (
          <>
            <div className="ai-attachments-row">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className={`ai-attachment-chip ${att.kind === 'image' ? 'ai-attachment-chip--image' : ''}`}
                >
                  {att.kind === 'image' ? (
                    <img src={att.previewUrl} alt={att.name} className="ai-attachment-chip__thumb" />
                  ) : (
                    <>
                      <span className="ai-attachment-chip__icon">
                        {att.kind === 'text' ? '📝' : '📄'}
                      </span>
                      <div className="ai-attachment-chip__info">
                        <div className="ai-attachment-chip__name">{att.name}</div>
                        <div className="ai-attachment-chip__size">{formatSize(att.size)}</div>
                      </div>
                    </>
                  )}
                  <button
                    className="ai-attachment-chip__remove"
                    onClick={() => onRemoveAttachment(att.id)}
                    title={t('common.delete')}
                  >
                    <SvgIcon name="IconClose" size={12} color="white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="ai-attachment-note">{t('ai.attachmentsComingSoonNote')}</div>
          </>
        )}

        <div className="ai-input-box">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="ai-icon-btn"
            title={t('ai.attach')}
          >
            <SvgIcon name="IconAttach" size={18} color="#65676B" />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={t('ai.inputPlaceholder')}
            rows={1}
            disabled={isSending}
          />

          <button
            onClick={onSend}
            disabled={!canSend}
            className={`ai-input-box__send ${canSend ? 'ai-input-box__send--active' : ''}`}
            title={t('ai.send')}
          >
            <SvgIcon name="IconSend" size={16} color={canSend ? 'white' : '#9ca3af'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiInputBar;