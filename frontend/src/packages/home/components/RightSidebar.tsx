// ============================================================
// RightSidebar.tsx — Contacts + Sponsored (chỉ hiện xl+)
// Màu từ fb-* tokens
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';

interface RightSidebarProps { onRequireLogin: () => void; }

const MOCK_CONTACTS = [
  { id: 1, name: 'Linh Nguyễn',     avatar: '👩',     online: true  },
  { id: 2, name: 'Minh Trần',       avatar: '👨',     online: true  },
  { id: 3, name: 'Sophie Anderson', avatar: '👱‍♀️',   online: true  },
  { id: 4, name: 'Kai Yamamoto',    avatar: '🧑',     online: true  },
  { id: 5, name: 'Carlos Rivera',   avatar: '👦',     online: false },
  { id: 6, name: 'Amara Diallo',    avatar: '👩‍🦱', online: true  },
  { id: 7, name: 'Lucas Becker',    avatar: '🧔',     online: false },
  { id: 8, name: 'Priya Sharma',    avatar: '👩‍🦳', online: true  },
];

const MOCK_SPONSORED = [
  { id: 1, brand: 'TravelEasy',   desc: 'Khám phá ưu đãi du lịch tốt nhất!',        gradient: 'from-sky-400 to-blue-600',    emoji: '✈️' },
  { id: 2, brand: 'FoodieBox VN', desc: 'Nguyên liệu tươi ngon giao tận nhà mỗi tuần', gradient: 'from-green-400 to-emerald-600', emoji: '🥗' },
];

const RightSidebar: React.FC<RightSidebarProps> = ({ onRequireLogin }) => {
  const { t } = useTranslation();
  const soon = () => alert(`⏳ ${t('common.comingSoon')}\n\n${t('common.comingSoonMessage')}`);

  return (
    <aside className="hidden xl:flex flex-col w-[280px] fixed right-0 top-14 h-[calc(100vh-56px)] overflow-y-auto py-4 px-4 gap-5 scrollbar-hide">

      {/* Sponsored */}
      <section>
        <h3 className="text-[1.0625rem] font-semibold text-fb-text mb-3">{t('home.sponsored')}</h3>
        <div className="flex flex-col gap-3">
          {MOCK_SPONSORED.map(ad => (
            <button key={ad.id} onClick={soon} className="flex items-center gap-3 group text-left w-full rounded-lg hover:bg-fb-bg-hover p-1 transition-colors">
              <div className={`w-[100px] h-[100px] rounded-lg bg-gradient-to-br ${ad.gradient} flex items-center justify-center text-4xl flex-shrink-0`}>
                {ad.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-fb-text group-hover:text-fb-primary transition-colors leading-snug">{ad.brand}</p>
                <p className="text-xs text-fb-text-secondary mt-0.5 leading-snug line-clamp-3">{ad.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="h-[1px] bg-fb-border" />

      {/* Contacts */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[1.0625rem] font-semibold text-fb-text">{t('home.contacts')}</h3>
          <div className="flex items-center gap-1">
            <button onClick={soon} className="w-8 h-8 rounded-full hover:bg-fb-bg-hover flex items-center justify-center transition-colors">
              <SvgIcon name="IconSearch" size={16} color="#65676B" />
            </button>
            <button onClick={soon} className="w-8 h-8 rounded-full hover:bg-fb-bg-hover flex items-center justify-center transition-colors">
              <SvgIcon name="IconMoreHoriz" size={16} color="#65676B" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {MOCK_CONTACTS.map(c => (
            <button key={c.id} onClick={onRequireLogin}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-fb-bg-hover transition-colors text-left w-full group">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center text-lg">
                  {c.avatar}
                </div>
                {c.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-fb-online border-2 border-fb-bg-card" />
                )}
              </div>
              <span className="text-sm font-medium text-fb-text group-hover:text-fb-primary transition-colors">
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="mt-auto">
        <div className="flex flex-wrap gap-x-1 gap-y-0.5">
          {[t('home.footerPrivacy'), t('home.footerTerms'), t('home.footerAdvertising'),
            t('home.footerCookies'), t('home.footerMore')].map((link, i) => (
            <button key={i} onClick={soon} className="text-fb-text-secondary text-[11px] hover:underline">{link}</button>
          ))}
        </div>
        <p className="text-fb-text-secondary text-[11px] mt-1">{t('home.footerMeta', { year: new Date().getFullYear() })}</p>
      </div>
    </aside>
  );
};

export default RightSidebar;
