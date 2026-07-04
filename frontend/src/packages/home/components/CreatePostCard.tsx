// ============================================================
// CreatePostCard.tsx — "Bạn đang nghĩ gì?" card
// Màu từ fb-* tokens
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';

interface CreatePostCardProps { onRequireLogin: () => void; }

const CreatePostCard: React.FC<CreatePostCardProps> = ({ onRequireLogin }) => {
  const { t } = useTranslation();

  const actions = [
    { icon: 'IconVideoCamera' as const, color: '#F3425F', label: t('home.liveVideo') },
    { icon: 'IconCamera'      as const, color: '#45BD62', label: t('home.photoVideo') },
    { icon: 'IconEmoji'       as const, color: '#F7B928', label: t('home.feeling') },
  ];

  return (
    <div className="bg-fb-bg-card rounded-xl shadow-sm border border-fb-border p-3">
      <div className="flex items-center gap-2">
        <button onClick={onRequireLogin} className="w-10 h-10 rounded-full bg-fb-bg-input flex items-center justify-center flex-shrink-0 hover:brightness-95 transition-all">
          <SvgIcon name="IconUser" size={24} color="#65676B" />
        </button>
        <button
          onClick={onRequireLogin}
          className="flex-1 bg-fb-bg-input hover:bg-fb-bg-hover-dark rounded-full px-4 py-2.5 text-left text-fb-text-secondary text-sm transition-colors"
        >
          {t('home.whatsOnYourMindGuest')}
        </button>
      </div>

      <div className="h-[1px] bg-fb-border my-3" />

      <div className="flex items-center">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={onRequireLogin}
            className="flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-lg hover:bg-fb-bg-hover transition-colors"
          >
            <SvgIcon name={a.icon} size={20} color={a.color} />
            <span className="text-xs sm:text-sm font-medium text-fb-text-secondary hidden xs:inline sm:inline">
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreatePostCard;
