// ============================================================
// AiChatHeader.tsx — src/modules/ai/components/AiChatHeader.tsx
// Header vùng chat: logo AI, tên, trạng thái, actions
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';

interface AiChatHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onRequireLogin: () => void;
}

const AiChatHeader: React.FC<AiChatHeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  onRequireLogin,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex-shrink-0 px-4 py-3 border-b border-fb-border bg-fb-bg-card flex items-center gap-3">
      {/* Mobile: hamburger toggle */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden w-9 h-9 rounded-full hover:bg-fb-bg-hover flex items-center justify-center text-fb-text-secondary transition-colors"
        title={sidebarOpen ? t('ai.closeSidebar') : t('ai.openSidebar')}
      >
        <SvgIcon name="IconMenu" size={20} color="currentColor" />
      </button>

      {/* Desktop: open sidebar arrow (chỉ hiện khi sidebar đóng) */}
      {!sidebarOpen && (
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex w-8 h-8 rounded-full hover:bg-fb-bg-hover items-center justify-center text-fb-text-secondary transition-colors"
          title={t('ai.openSidebar')}
        >
          <SvgIcon name="IconChevronRight" size={18} color="currentColor" />
        </button>
      )}

      {/* AI avatar */}
      <div className="w-9 h-9 rounded-full bg-fb-primary flex items-center justify-center flex-shrink-0">
        <SvgIcon name="IconAI" size={20} color="white" />
      </div>

      {/* Name + status */}
      <div>
        <h3 className="text-sm font-semibold text-fb-text">{t('ai.assistantName')}</h3>
        <p className="text-xs text-green-600 flex items-center gap-1">
          <SvgIcon name="IconOnlineDot" size={8} color="#31A24C" />
          {t('ai.online')}
        </p>
      </div>

      {/* Actions — cần đăng nhập */}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onRequireLogin}
          className="w-9 h-9 rounded-full hover:bg-fb-bg-hover flex items-center justify-center text-fb-text-secondary transition-colors"
          title={t('ai.shareLockedTooltip')}
        >
          <SvgIcon name="IconShare" size={18} color="currentColor" />
        </button>
        <button
          onClick={onRequireLogin}
          className="w-9 h-9 rounded-full hover:bg-fb-bg-hover flex items-center justify-center text-fb-text-secondary transition-colors"
          title={t('ai.moreLockedTooltip')}
        >
          <SvgIcon name="IconMoreHoriz" size={18} color="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default AiChatHeader;