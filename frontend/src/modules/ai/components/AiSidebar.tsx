// ============================================================
// AiSidebar.tsx — src/modules/ai/components/AiSidebar.tsx
// Sidebar trái trang AI: danh sách conversation, new chat, search
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';

interface Conversation {
  id: string;
  titleKey: string;
  previewKey: string;
  dateKey: string;
  locked: boolean;
}

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeConvId: string;
  onConvClick: (id: string) => void;
  onRequireLogin: () => void;
}

const CONVERSATIONS: Conversation[] = [
  { id: '1', titleKey: 'ai.conv1Title', previewKey: 'ai.conv1Preview', dateKey: 'ai.today',     locked: false },
  { id: '2', titleKey: 'ai.conv2Title', previewKey: 'ai.conv2Preview', dateKey: 'ai.today',     locked: true  },
  { id: '3', titleKey: 'ai.conv3Title', previewKey: 'ai.conv3Preview', dateKey: 'ai.yesterday', locked: true  },
  { id: '4', titleKey: 'ai.conv4Title', previewKey: 'ai.conv4Preview', dateKey: 'ai.yesterday', locked: true  },
  { id: '5', titleKey: 'ai.conv5Title', previewKey: 'ai.conv5Preview', dateKey: '25/03',        locked: true  },
  { id: '6', titleKey: 'ai.conv6Title', previewKey: 'ai.conv6Preview', dateKey: '24/03',        locked: true  },
  { id: '7', titleKey: 'ai.conv7Title', previewKey: 'ai.conv7Preview', dateKey: '23/03',        locked: true  },
];

const AiSidebar: React.FC<AiSidebarProps> = ({
  isOpen,
  onClose,
  activeConvId,
  onConvClick,
  onRequireLogin,
}) => {
  const { t } = useTranslation();

  const handleConvClick = (conv: Conversation) => {
    if (conv.locked) {
      onRequireLogin();
    } else {
      onConvClick(conv.id);
    }
  };

  return (
    <aside
      className={`
        flex-shrink-0 bg-fb-bg-card border-r border-fb-border
        flex-col overflow-hidden transition-all duration-300
        ${isOpen ? 'w-[280px]' : 'w-0'}
        hidden md:flex
      `}
    >
      {/* ── Header ── */}
      <div className="p-4 border-b border-fb-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-fb-text">{t('ai.title')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-fb-bg-hover flex items-center justify-center text-fb-text-secondary transition-colors"
            title={t('ai.closeSidebar')}
          >
            <SvgIcon name="IconChevronLeft" size={18} color="currentColor" />
          </button>
        </div>

        {/* New Chat — cần đăng nhập */}
        <button
          onClick={onRequireLogin}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-fb-primary hover:bg-fb-primary-hover text-white transition-colors"
          title={t('ai.newChatLockedTooltip')}
        >
          <SvgIcon name="IconPlus" size={18} color="white" />
          {t('ai.newChat')}
          <SvgIcon name="IconLock" size={14} color="white" className="ml-auto opacity-70" />
        </button>
      </div>

      {/* ── Search ── */}
      <div className="px-3 py-2 flex-shrink-0">
        <button
          onClick={onRequireLogin}
          className="w-full flex items-center gap-2 px-3 py-2 bg-fb-bg-input rounded-lg text-fb-text-secondary text-sm hover:bg-fb-bg-hover-dark transition-colors"
        >
          <SvgIcon name="IconSearch" size={16} color="currentColor" />
          {t('ai.searchConversations')}
        </button>
      </div>

      {/* ── Conversation list ── */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        <p className="px-2 py-1 text-xs font-semibold text-fb-text-secondary uppercase tracking-wider">
          {t('ai.recent')}
        </p>

        {CONVERSATIONS.map((conv) => {
          const isActive = activeConvId === conv.id && !conv.locked;
          return (
            <button
              key={conv.id}
              onClick={() => handleConvClick(conv)}
              className={`
                w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-colors
                ${isActive ? 'bg-fb-primary-light' : 'hover:bg-fb-bg-hover'}
              `}
            >
              <div className="flex items-start gap-2">
                {/* AI mini avatar */}
                <div className="w-7 h-7 rounded-full bg-fb-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <SvgIcon name="IconAI" size={14} color="white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-fb-primary' : 'text-fb-text'}`}>
                      {t(conv.titleKey)}
                      {conv.locked && (
                        <SvgIcon name="IconLock" size={11} color="currentColor" className="inline ml-1 opacity-40" />
                      )}
                    </p>
                    <span className="text-[10px] text-fb-text-secondary flex-shrink-0">
                      {/* dateKey là 'ai.today', 'ai.yesterday', hoặc literal date string */}
                      {conv.dateKey.startsWith('ai.') ? t(conv.dateKey) : conv.dateKey}
                    </span>
                  </div>
                  <p className="text-xs text-fb-text-secondary truncate mt-0.5">
                    {t(conv.previewKey)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Login hint */}
        <div className="mx-2 mt-3 p-3 rounded-xl border border-dashed border-fb-border">
          <p className="text-xs text-fb-text-secondary text-center leading-relaxed">
            <SvgIcon name="IconLock" size={14} color="currentColor" className="inline mb-0.5 mr-1 opacity-50" />
            <button onClick={onRequireLogin} className="text-fb-primary font-medium hover:underline">
              {t('ai.loginLink')}
            </button>
            {' '}{t('ai.loginToSaveHistory').replace(t('ai.loginLink'), '').trim()}
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="p-3 border-t border-fb-border flex-shrink-0">
        <button
          onClick={onRequireLogin}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-fb-bg-hover transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-fb-bg-hover-dark flex items-center justify-center flex-shrink-0">
            <SvgIcon name="IconUser" size={18} color="currentColor" className="text-fb-text-secondary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-fb-text">{t('ai.guestUser')}</p>
            <p className="text-xs text-fb-text-secondary">{t('ai.guestSyncHint')}</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default AiSidebar;