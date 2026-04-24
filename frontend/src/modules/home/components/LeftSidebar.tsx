// ============================================================
// LeftSidebar.tsx — src/modules/home/components/LeftSidebar.tsx
// Responsive: ẩn hoàn toàn < lg, icon-only lg, full xl+
// Màu từ fb-* tokens (src/core/theme/colors.ts)
// ============================================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon, { IconName } from '../../../core/icons/SvgIcon';

interface LeftSidebarProps { onRequireLogin: () => void; }

interface SidebarItem {
  icon: IconName;
  iconColor: string;
  bgToken: string;      // Tailwind class bg-fb-icon-*
  label: string;
  action: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onRequireLogin }) => {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const soon = () => alert(`⏳ ${t('common.comingSoon')}\n\n${t('common.comingSoonMessage')}`);

  const mainItems: SidebarItem[] = [
    { icon: 'IconUser',        iconColor: '#050505', bgToken: 'bg-fb-icon-profile',  label: 'Alex Johnson',           action: onRequireLogin },
    { icon: 'IconFriends',     iconColor: '#fff',    bgToken: 'bg-fb-icon-friends',  label: t('home.friends'),        action: onRequireLogin },
    { icon: 'IconMemories',    iconColor: '#fff',    bgToken: 'bg-fb-icon-memories', label: t('home.memories'),       action: onRequireLogin },
    { icon: 'IconSaved',       iconColor: '#fff',    bgToken: 'bg-fb-icon-saved',    label: t('home.saved'),          action: onRequireLogin },
    { icon: 'IconGroups',      iconColor: '#fff',    bgToken: 'bg-fb-icon-groups',   label: t('navigation.groups'),   action: soon },
    { icon: 'IconWatch',       iconColor: '#fff',    bgToken: 'bg-fb-icon-watch',    label: t('home.watchVideos'),    action: soon },
    { icon: 'IconMarketplace', iconColor: '#fff',    bgToken: 'bg-fb-icon-market',   label: t('navigation.marketplace'), action: soon },
  ];

  const moreItems: SidebarItem[] = [
    { icon: 'IconEvents',   iconColor: '#fff', bgToken: 'bg-fb-icon-events',   label: t('home.events'),          action: soon },
    { icon: 'IconGaming',   iconColor: '#fff', bgToken: 'bg-fb-icon-gaming',   label: t('navigation.gaming'),    action: soon },
    { icon: 'IconTag',      iconColor: '#fff', bgToken: 'bg-fb-icon-pages',    label: t('home.pages'),           action: soon },
    { icon: 'IconSettings', iconColor: '#fff', bgToken: 'bg-fb-icon-settings', label: t('navigation.settings'), action: soon },
  ];

  const visible = showMore ? [...mainItems, ...moreItems] : mainItems;

  return (
    // lg: icon-only (w-16), xl: full width (w-[280px])
    <aside className="hidden lg:flex flex-col fixed left-0 top-14 h-[calc(100vh-56px)] overflow-y-auto py-3 scrollbar-hide
      w-16 xl:w-[280px] px-1 xl:px-2 transition-all duration-200">

      <nav className="flex flex-col gap-0.5">
        {visible.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            title={item.label}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-fb-bg-hover transition-colors text-left w-full group"
          >
            <div className={`w-9 h-9 rounded-full ${item.bgToken} flex items-center justify-center flex-shrink-0`}>
              <SvgIcon name={item.icon} size={20} color={item.iconColor} />
            </div>
            {/* Label only visible on xl+ */}
            <span className="hidden xl:inline text-[0.9375rem] font-medium text-fb-text leading-snug truncate">
              {item.label}
            </span>
          </button>
        ))}

        {/* See more/less */}
        <button
          onClick={() => setShowMore(!showMore)}
          title={showMore ? t('home.seeLess') : t('home.seeMore')}
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-fb-bg-hover transition-colors text-left w-full"
        >
          <div className="w-9 h-9 rounded-full bg-fb-icon-bg flex items-center justify-center flex-shrink-0">
            <SvgIcon
              name="IconArrowDown"
              size={20}
              color="#050505"
              className={`transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
            />
          </div>
          <span className="hidden xl:inline text-[0.9375rem] font-medium text-fb-text">
            {showMore ? t('home.seeLess') : t('home.seeMore')}
          </span>
        </button>
      </nav>

      {/* Divider + Shortcuts — xl only */}
      <div className="hidden xl:block">
        <div className="h-[1px] bg-fb-border my-3 mx-1" />

        <div className="px-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[1.0625rem] font-semibold text-fb-text">{t('home.shortcuts')}</h3>
            <button onClick={soon} className="text-sm text-fb-primary hover:underline">
              {t('home.seeMore')}
            </button>
          </div>

          {[
            { name: 'Photography Lovers', members: '12K members', emoji: '📸' },
            { name: 'Tech Talk Community', members: '45K members', emoji: '💻' },
            { name: 'Travel & Adventure',  members: '8.2K members', emoji: '✈️' },
          ].map((g, i) => (
            <button
              key={i}
              onClick={soon}
              className="flex items-center gap-3 py-2 rounded-lg hover:bg-fb-bg-hover transition-colors text-left w-full"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-lg flex-shrink-0">
                {g.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-fb-text leading-tight truncate">{g.name}</p>
                <p className="text-xs text-fb-text-secondary">{g.members}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer — xl only */}
      <div className="hidden xl:block mt-auto px-1 pt-4">
        <div className="flex flex-wrap gap-x-1 gap-y-0.5">
          {[t('home.footerPrivacy'), t('home.footerTerms'), t('home.footerAdvertising'),
            t('home.footerAdChoices'), t('home.footerCookies'), t('home.footerMore')
          ].map((link, i) => (
            <button key={i} onClick={soon} className="text-fb-text-secondary text-xs hover:underline">
              {link}
            </button>
          ))}
        </div>
        <p className="text-fb-text-secondary text-xs mt-1">
          {t('home.footerMeta', { year: new Date().getFullYear() })}
        </p>
      </div>
    </aside>
  );
};

export default LeftSidebar;
