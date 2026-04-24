// ============================================================
// StoryRow.tsx — Hàng Stories cuộn ngang
// Màu từ fb-* tokens
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';

interface StoryRowProps { onRequireLogin: () => void; }

const MOCK_STORIES = [
  { id: 1, user: 'Maria Garcia',  gradient: 'from-[#F472B6] to-[#F43F5E]', avatar: '👩',  hasNew: true },
  { id: 2, user: 'James Wilson',  gradient: 'from-[#60A5FA] to-[#22D3EE]', avatar: '👨',  hasNew: true },
  { id: 3, user: 'Linh Nguyễn',  gradient: 'from-[#4ADE80] to-[#10B981]', avatar: '🧑',  hasNew: false },
  { id: 4, user: 'Tomás Müller',  gradient: 'from-[#C084FC] to-[#8B5CF6]', avatar: '🧔',  hasNew: true },
];

const StoryRow: React.FC<StoryRowProps> = ({ onRequireLogin }) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {/* Create story card */}
      <button
        onClick={onRequireLogin}
        className="flex-shrink-0 w-[100px] sm:w-[112px] h-[180px] sm:h-[200px] rounded-xl overflow-hidden relative bg-fb-bg-card border border-fb-border hover:brightness-95 transition-all shadow-sm"
      >
        <div className="h-[65%] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <span className="text-3xl">🙂</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-fb-bg-card pt-5 pb-3 px-2 text-center">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-fb-primary border-4 border-fb-bg-card flex items-center justify-center">
            <SvgIcon name="IconPlus" size={18} color="#fff" />
          </div>
          <p className="text-[11px] sm:text-xs font-semibold text-fb-text mt-1 leading-tight">
            {t('home.createStory')}
          </p>
        </div>
      </button>

      {MOCK_STORIES.map(s => (
        <button
          key={s.id}
          onClick={onRequireLogin}
          className="flex-shrink-0 w-[100px] sm:w-[112px] h-[180px] sm:h-[200px] rounded-xl overflow-hidden relative hover:brightness-95 transition-all shadow-sm"
        >
          <div className={`absolute inset-0 bg-gradient-to-b ${s.gradient}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl">{s.avatar}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
          <div className={`absolute top-3 left-3 w-9 h-9 rounded-full border-4 ${s.hasNew ? 'border-fb-primary' : 'border-fb-border'} bg-gray-200 flex items-center justify-center text-base overflow-hidden`}>
            {s.avatar}
          </div>
          <p className="absolute bottom-3 left-2 right-2 text-white text-[11px] sm:text-xs font-semibold text-left leading-tight line-clamp-2">
            {s.user}
          </p>
        </button>
      ))}
    </div>
  );
};

export default StoryRow;
