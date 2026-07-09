// ============================================================
// AiDetailPanel.tsx — src/packages/ai/components/AiDetailPanel.tsx
// Khung chi tiết bên phải, hiển thị thông tin AI đã thu thập được cho
// 1 tin nhắn cụ thể: bảng tổng hợp trực quan (triệu chứng, nguyên nhân,
// hậu quả, biện pháp...), chuyên khoa gợi ý, và nguồn tham khảo. Có thể
// đóng/mở và KÉO THẢ để tùy chỉnh chiều rộng tự do (không còn giới hạn
// 2 mức cố định).
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';
import { MessageSource, StructuredSummary, EmergencyLevel } from './AiMessageBubble';

export interface DetailPanelData {
  sources?: MessageSource[];
  suggestedSpecialties?: string[];
  emergency?: boolean;
  topicMismatch?: boolean;
  structuredSummary?: StructuredSummary | null;
}

interface AiDetailPanelProps {
  isOpen: boolean;
  widthPx: number;
  data: DetailPanelData | null;
  onClose: () => void;
  onStartResize: (e: React.MouseEvent) => void;
}

const EMERGENCY_LEVEL_CONFIG: Record <
  EmergencyLevel,
  { labelKey: string; defaultLabel: string; className: string }
> = {
  NORMAL: {
    labelKey: 'ai.emergencyLevel.normal',
    defaultLabel: 'Bình thường',
    className: 'ai-detail-panel__level-badge--normal',
  },
  MONITOR: {
    labelKey: 'ai.emergencyLevel.monitor',
    defaultLabel: 'Nên theo dõi',
    className: 'ai-detail-panel__level-badge--monitor',
  },
  SEE_DOCTOR_SOON: {
    labelKey: 'ai.emergencyLevel.seeDoctorSoon',
    defaultLabel: 'Cần khám sớm',
    className: 'ai-detail-panel__level-badge--see-doctor-soon',
  },
  EMERGENCY: {
    labelKey: 'ai.emergencyLevel.emergency',
    defaultLabel: 'Cấp cứu',
    className: 'ai-detail-panel__level-badge--emergency',
  },
};

const AiDetailPanel: React.FC<AiDetailPanelProps> = ({
  isOpen,
  widthPx,
  data,
  onClose,
  onStartResize,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const summary = data?.structuredSummary;
  const hasSources = !!data?.sources && data.sources.length > 0;
  const hasSpecialties = !!data?.suggestedSpecialties && data.suggestedSpecialties.length > 0;
  const hasSummary = !!summary;

  const levelConfig = summary ? EMERGENCY_LEVEL_CONFIG[summary.emergencyLevel] : null;

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
        {!hasSummary && !hasSources && !hasSpecialties && (
          <p className="ai-detail-panel__empty">
            {t('ai.detailPanelEmpty', {
              defaultValue: 'Chưa có thông tin chi tiết nào cho tin nhắn này.',
            })}
          </p>
        )}

        {/* ── Mức độ khẩn cấp — luôn đặt đầu tiên, dễ nhìn nhất ── */}
        {levelConfig && (
          <div className={`ai-detail-panel__level-badge ${levelConfig.className}`}>
            {t(levelConfig.labelKey, { defaultValue: levelConfig.defaultLabel })}
          </div>
        )}
        {!levelConfig && data?.emergency && (
          <div className="ai-detail-panel__level-badge ai-detail-panel__level-badge--emergency">
            ⚠️ {t('ai.detailPanelEmergency', { defaultValue: 'Dấu hiệu cấp cứu' })}
          </div>
        )}

        {/* ── Tóm tắt nhanh ── */}
        {summary?.quickSummary && (
          <section className="ai-detail-panel__section">
            <p className="ai-detail-panel__quick-summary">{summary.quickSummary}</p>
          </section>
        )}

        {/* ── Triệu chứng ── */}
        {summary && summary.symptoms.length > 0 && (
          <section className="ai-detail-panel__section">
            <h4 className="ai-detail-panel__section-title">
              {t('ai.detailPanelSymptoms', { defaultValue: 'Triệu chứng' })}
            </h4>
            <ul className="ai-detail-panel__tag-list">
              {summary.symptoms.map((s, i) => (
                <li key={i} className="ai-detail-panel__tag">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Nguyên nhân — phân nhóm theo mức độ phổ biến ── */}
        {summary &&
          (summary.commonCauses.length > 0 ||
            summary.rareCauses.length > 0 ||
            summary.seriousCauses.length > 0) && (
            <section className="ai-detail-panel__section">
              <h4 className="ai-detail-panel__section-title">
                {t('ai.detailPanelCauses', { defaultValue: 'Nguyên nhân có thể' })}
              </h4>

              {summary.commonCauses.length > 0 && (
                <div className="ai-detail-panel__cause-group">
                  <span className="ai-detail-panel__cause-group-label">
                    {t('ai.detailPanelCausesCommon', { defaultValue: 'Phổ biến' })}
                  </span>
                  <ul className="ai-detail-panel__bullet-list">
                    {summary.commonCauses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.rareCauses.length > 0 && (
                <div className="ai-detail-panel__cause-group">
                  <span className="ai-detail-panel__cause-group-label">
                    {t('ai.detailPanelCausesRare', { defaultValue: 'Ít gặp hơn' })}
                  </span>
                  <ul className="ai-detail-panel__bullet-list">
                    {summary.rareCauses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.seriousCauses.length > 0 && (
                <div className="ai-detail-panel__cause-group ai-detail-panel__cause-group--serious">
                  <span className="ai-detail-panel__cause-group-label">
                    {t('ai.detailPanelCausesSerious', { defaultValue: 'Cần lưu ý' })}
                  </span>
                  <ul className="ai-detail-panel__bullet-list">
                    {summary.seriousCauses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

        {/* ── Hậu quả nếu không điều trị ── */}
        {summary?.consequences && (
          <section className="ai-detail-panel__section">
            <h4 className="ai-detail-panel__section-title">
              {t('ai.detailPanelConsequences', { defaultValue: 'Nếu không xử lý' })}
            </h4>
            <p className="ai-detail-panel__text">{summary.consequences}</p>
          </section>
        )}

        {/* ── Biện pháp: tự chăm sóc tại nhà ── */}
        {summary && summary.selfCareActions.length > 0 && (
          <section className="ai-detail-panel__section">
            <h4 className="ai-detail-panel__section-title">
              {t('ai.detailPanelSelfCare', { defaultValue: 'Có thể tự chăm sóc tại nhà' })}
            </h4>
            <ul className="ai-detail-panel__bullet-list">
              {summary.selfCareActions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Biện pháp: khi nào cần đi khám ── */}
        {summary && summary.whenToSeeDoctor.length > 0 && (
          <section className="ai-detail-panel__section">
            <h4 className="ai-detail-panel__section-title">
              {t('ai.detailPanelWhenToSeeDoctor', { defaultValue: 'Nên đi khám nếu' })}
            </h4>
            <ul className="ai-detail-panel__bullet-list">
              {summary.whenToSeeDoctor.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Chuyên khoa gợi ý ── */}
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

        {/* ── Nguồn tham khảo ── */}
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