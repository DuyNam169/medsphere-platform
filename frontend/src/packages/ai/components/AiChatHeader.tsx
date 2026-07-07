// ============================================================
// AiChatHeader.tsx — src/packages/ai/components/AiChatHeader.tsx
// Header gọn của vùng chat — tự nhận biết trạng thái đăng nhập.
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';

interface AiChatHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onRequireLogin: () => void;
  isAuthenticated: boolean;
}

const AiChatHeader: React.FC<AiChatHeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  onRequireLogin,
  isAuthenticated,
}) => {
  const { t } = useTranslation();

  return (
    <div className="ai-chat-header">
      <button
        className="ai-icon-btn"
        onClick={onToggleSidebar}
        title={sidebarOpen ? t('ai.closeSidebar') : t('ai.openSidebar')}
      >
        <SvgIcon name={sidebarOpen ? 'IconChevronLeft' : 'IconChevronRight'} size={16} color="currentColor" />
      </button>

      <div className="ai-chat-header__avatar">
        <SvgIcon name="IconAI" size={18} color="white" />
      </div>

      <div>
        <div className="ai-chat-header__name">{t('ai.assistantName')}</div>
        <div className="ai-chat-header__status">
          <span className="ai-chat-header__dot" />
          {t('ai.online')}
        </div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.25rem' }}>
        <button
          className="ai-icon-btn"
          onClick={isAuthenticated ? undefined : onRequireLogin}
          title={isAuthenticated ? t('ai.share') : t('ai.shareLockedTooltip')}
        >
          <SvgIcon name="IconShare" size={16} color="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default AiChatHeader;