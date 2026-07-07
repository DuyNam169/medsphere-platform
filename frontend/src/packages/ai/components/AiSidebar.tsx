// ============================================================
// AiSidebar.tsx — src/packages/ai/components/AiSidebar.tsx
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';
import { useAuthStore } from '../../../core/store/authStore';
import { ConversationSummary } from '../services/chatService';

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeConvId: string | null;
  onConvClick: (id: string) => void;
  onRequireLogin: () => void;
  onNewChat: () => void;
  isAuthenticated: boolean;
  conversations: ConversationSummary[];
  isLoadingConversations: boolean;
}

const AiSidebar: React.FC<AiSidebarProps> = ({
  isOpen,
  onClose,
  activeConvId,
  onConvClick,
  onRequireLogin,
  onNewChat,
  isAuthenticated,
  conversations,
  isLoadingConversations,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <aside className={`ai-sidebar ${isOpen ? 'ai-sidebar--open' : ''}`}>
      <div className="ai-sidebar__inner">
        <div className="ai-sidebar__header">
          <div className="ai-sidebar__title-row">
            <span className="ai-sidebar__title">{t('ai.title')}</span>
            <button className="ai-icon-btn" onClick={onClose} title={t('ai.closeSidebar')}>
              <SvgIcon name="IconChevronLeft" size={16} color="currentColor" />
            </button>
          </div>

          <button className="ai-sidebar__new-chat" onClick={onNewChat}>
            <SvgIcon name="IconPlus" size={16} color="white" />
            {t('ai.newChat')}
          </button>
        </div>

        <div className="ai-sidebar__list">
          {!isAuthenticated ? (
            <div className="ai-sidebar__login-hint">
              <p>
                <button onClick={onRequireLogin}>{t('ai.loginLink')}</button>{' '}
                {t('ai.loginToSaveHistory')}
              </p>
            </div>
          ) : isLoadingConversations ? (
            <div className="ai-sidebar__login-hint">
              <p>...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="ai-sidebar__login-hint">
              <p>{t('ai.noSavedConversations')}</p>
            </div>
          ) : (
            <>
              <div className="ai-sidebar__section-label">{t('ai.recent')}</div>
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onConvClick(conv.id)}
                  className={`ai-sidebar__conv-item ${
                    activeConvId === conv.id ? 'ai-sidebar__conv-item--active' : ''
                  }`}
                  title={conv.title || t('ai.newChat')}
                >
                  <span className="ai-sidebar__conv-item__title">
                    {conv.title || t('ai.newChat')}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="ai-sidebar__footer">
          <button
            className="ai-sidebar__user-btn"
            onClick={isAuthenticated ? undefined : onRequireLogin}
          >
            <div className="ai-sidebar__user-avatar" style={{ overflow: 'hidden' }}>
              {isAuthenticated && user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || user.email}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }}
                />
              ) : (
                <SvgIcon name="IconUser" size={16} color="currentColor" />
              )}
            </div>
            <div>
              <p className="ai-sidebar__user-name">
                {isAuthenticated ? (user?.fullName || user?.email || t('ai.myAccount')) : t('ai.guestUser')}
              </p>
              {!isAuthenticated && (
                <p className="ai-sidebar__user-hint">{t('ai.guestSyncHint')}</p>
              )}
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AiSidebar;