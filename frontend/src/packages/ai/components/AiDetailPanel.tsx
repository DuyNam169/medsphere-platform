// ============================================================
// AiDetailPanel.tsx — src/packages/ai/components/AiDetailPanel.tsx
// Khung chi tiết bên phải, hiển thị thông tin AI đã thu thập được cho
// 1 tin nhắn cụ thể (nguồn tham khảo, chuyên khoa gợi ý, cảnh báo khẩn
// cấp...). Có thể đóng/mở và KÉO THẢ để tùy chỉnh chiều rộng tự do
// (không còn giới hạn 2 mức cố định).
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';
import { MessageSource } from './AiMessageBubble';

export interface DetailPanelData {
  sources?: MessageSource[];
  suggestedSpecialties?: string[];
  emergency?: boolean;
  topicMismatch?: boolean;
}

interface AiDetailPanelProps {
  isOpen: boolean;
  widthPx: number;
  data: DetailPanelData | null;
  onClose: () => void;
  onStartResize: (e: React.MouseEvent) => void;
}

const AiDetailPanel: React.FC<AiDetailPanelProps> = ({
  isOpen,
  widthPx,
  data,
  onClose,
  onStartResize,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const hasSources = !!data?.sources && data.sources.length > 0;
  const hasSpecialties = !!data?.suggestedSpecialties && data.suggestedSpecialties.length > 0;

  return (
    <aside className="ai-detail-panel" style={{ width: `${widthPx}px` }}>
      {/* Thanh kéo thả — rê chuột vào cạnh trái của khung để đổi kích thước */}
      <div
        className="ai-detail-panel__resize-handle"
        onMouseDown={onStartResize}
        title={t('ai.dragToResize', { defaultValue: 'Kéo để thay đổi kích thước' })}
      />

      <div className="ai-detail-panel__header">
        <span className="ai-detail-panel__title">
          {t('ai.detailPanelTitle', { defaultValue: 'Thông tin chi tiết' })}
        </span>
        <div className="ai-detail-panel__header-actions">
          <button
            type="button"
            className="ai-detail-panel__icon-btn"
            onClick={onClose}
            title={t('ai.closePanel', { defaultValue: 'Đóng' })}
          >
            <SvgIcon name="IconClose" size={16} color="currentColor" />
          </button>
        </div>
      </div>

      <div className="ai-detail-panel__body">
        {!hasSources && !hasSpecialties && (
          <p className="ai-detail-panel__empty">
            {t('ai.detailPanelEmpty', {
              defaultValue: 'Chưa có thông tin chi tiết nào cho tin nhắn này.',
            })}
          </p>
        )}

        {data?.emergency && (
          <div className="ai-detail-panel__emergency-badge">
            ⚠️ {t('ai.detailPanelEmergency', { defaultValue: 'Dấu hiệu cấp cứu' })}
          </div>
        )}

        {hasSpecialties && (
          <section className="ai-detail-panel__section">
            <h4 className="ai-detail-panel__section-title">
              {t('ai.detailPanelSpecialties', { defaultValue: 'Chuyên khoa gợi ý' })}
            </h4>
            <div className="ai-detail-panel__specialty-tags">
              {data!.suggestedSpecialties!.map((s) => (
                <span key={s} className="ai-detail-panel__specialty-tag">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {hasSources && (
          <section className="ai-detail-panel__section">
            <h4 className="ai-detail-panel__section-title">
              {t('ai.detailPanelSources', { defaultValue: 'Nguồn tham khảo' })}
            </h4>
            <ul className="ai-detail-panel__source-list">
              {data!.sources!.map((s, i) => (
                <li key={i} className="ai-detail-panel__source-card">
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    <span className="ai-detail-panel__source-title">{s.title || s.url}</span>
                    <span className="ai-detail-panel__source-url">{s.url}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </aside>
  );
};

export default AiDetailPanel;