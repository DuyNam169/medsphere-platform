// ============================================================
// PostCard.tsx — Bài post trong news feed
// Màu từ fb-* tokens. Responsive text sizes.
// MARK: API: GET /api/feed/posts → PostData[]
// ============================================================
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../../../core/icons/SvgIcon';

export interface PostData {
  id: number;
  author: string;
  authorAvatar: string;
  timeAgo: string;
  privacy: 'public' | 'friends' | 'only_me';
  content: string;
  imageUrl?: string;
  imageGradient?: string;
  likes: number;
  comments: number;
  shares: number;
  topReactions: string[];
}

interface PostCardProps { post: PostData; onRequireLogin: () => void; }

const PostCard: React.FC<PostCardProps> = ({ post, onRequireLogin }) => {
  const { t } = useTranslation();
  const [showReactions, setShowReactions] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soon = () => alert(`⏳ ${t('common.comingSoon')}\n\n${t('common.comingSoonMessage')}`);

  const reactions = [
    { emoji: '👍', label: t('home.like') },
    { emoji: '❤️', label: t('home.love') },
    { emoji: '😂', label: t('home.haha') },
    { emoji: '😮', label: t('home.wow') },
    { emoji: '😢', label: t('home.sad') },
    { emoji: '😡', label: t('home.angry') },
  ];

  const showPopup = () => { timerRef.current = setTimeout(() => setShowReactions(true), 500); };
  const hidePopup = () => { if (timerRef.current) clearTimeout(timerRef.current); setShowReactions(false); };

  return (
    <div className="bg-fb-bg-card rounded-xl shadow-sm border border-fb-border overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-3 sm:p-4 pb-2 sm:pb-3">
        <div className="flex items-center gap-2">
          <button onClick={onRequireLogin} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl flex-shrink-0 hover:brightness-95 transition-all">
            {post.authorAvatar}
          </button>
          <div>
            <button onClick={onRequireLogin} className="text-sm sm:text-[0.9375rem] font-semibold text-fb-text hover:underline leading-tight">
              {post.author}
            </button>
            <div className="flex items-center gap-1">
              <span className="text-xs text-fb-text-secondary">{post.timeAgo}</span>
              <span className="text-fb-text-secondary text-xs">·</span>
              <SvgIcon name="IconGlobe" size={11} color="#65676B" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={soon} className="w-9 h-9 rounded-full hover:bg-fb-bg-hover flex items-center justify-center transition-colors">
            <SvgIcon name="IconMoreHoriz" size={20} color="#65676B" />
          </button>
          <button onClick={soon} className="w-9 h-9 rounded-full hover:bg-fb-bg-hover flex items-center justify-center transition-colors">
            <SvgIcon name="IconClose" size={18} color="#65676B" />
          </button>
        </div>
      </div>

      {/* Content text */}
      {post.content && (
        <div className="px-3 sm:px-4 pb-3">
          <p className="text-sm sm:text-[0.9375rem] text-fb-text leading-snug">{post.content}</p>
        </div>
      )}

      {/* Image */}
      {post.imageGradient && (
        <div
          className={`w-full h-[200px] sm:h-[280px] md:h-[340px] bg-gradient-to-br ${post.imageGradient} cursor-pointer hover:brightness-95 transition-all`}
          onClick={onRequireLogin}
        />
      )}

      {/* Reaction summary */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {post.topReactions.length > 0 && (
            <div className="flex -space-x-1">
              {post.topReactions.map((emoji, i) => (
                <span key={i} className="w-[18px] h-[18px] rounded-full bg-fb-bg-card border border-fb-bg-card flex items-center justify-center text-[11px]" style={{ zIndex: post.topReactions.length - i }}>
                  {emoji}
                </span>
              ))}
            </div>
          )}
          <button onClick={onRequireLogin} className="text-xs text-fb-text-secondary hover:underline ml-1">
            {post.likes.toLocaleString()}
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-fb-text-secondary">
          <button onClick={onRequireLogin} className="hover:underline">{post.comments} {t('home.comments')}</button>
          <span>·</span>
          <button onClick={onRequireLogin} className="hover:underline">{post.shares} {t('home.shares')}</button>
        </div>
      </div>

      <div className="h-[1px] bg-fb-border mx-3 sm:mx-4" />

      {/* Action buttons */}
      <div className="px-1 sm:px-2 py-1 flex items-center gap-0.5 sm:gap-1">
        {/* Like — with hover popup */}
        <div className="relative flex-1">
          <button
            onMouseEnter={showPopup}
            onMouseLeave={hidePopup}
            onTouchStart={() => setShowReactions(!showReactions)}
            onClick={onRequireLogin}
            className="flex items-center justify-center gap-1 sm:gap-1.5 w-full py-1.5 rounded-lg hover:bg-fb-bg-hover transition-colors text-fb-text-secondary"
          >
            <SvgIcon name="IconThumbUp" size={18} color="currentColor" />
            <span className="text-xs sm:text-sm font-medium">{t('home.likeBtn')}</span>
          </button>
          {showReactions && (
            <div
              className="absolute bottom-full left-0 mb-1 bg-fb-bg-card rounded-full shadow-xl border border-fb-border flex items-center px-1.5 py-1 gap-0.5 z-20 whitespace-nowrap"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={hidePopup}
            >
              {reactions.map((r, i) => (
                <button key={i} onClick={() => { onRequireLogin(); setShowReactions(false); }} title={r.label}
                  className="text-xl sm:text-2xl hover:scale-125 transition-transform w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center">
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment */}
        <button onClick={onRequireLogin} className="flex items-center justify-center gap-1 sm:gap-1.5 flex-1 py-1.5 rounded-lg hover:bg-fb-bg-hover transition-colors text-fb-text-secondary">
          <SvgIcon name="IconComment" size={18} color="currentColor" />
          <span className="text-xs sm:text-sm font-medium">{t('home.commentBtn')}</span>
        </button>

        {/* Share */}
        <button onClick={onRequireLogin} className="flex items-center justify-center gap-1 sm:gap-1.5 flex-1 py-1.5 rounded-lg hover:bg-fb-bg-hover transition-colors text-fb-text-secondary">
          <SvgIcon name="IconShare" size={18} color="currentColor" />
          <span className="text-xs sm:text-sm font-medium">{t('home.shareBtn')}</span>
        </button>
      </div>

      {/* Comment input */}
      <div className="px-3 sm:px-4 pb-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-fb-bg-input flex items-center justify-center flex-shrink-0">
          <SvgIcon name="IconUser" size={18} color="#65676B" />
        </div>
        <button onClick={onRequireLogin} className="flex-1 bg-fb-bg-input hover:bg-fb-bg-hover-dark rounded-full px-3 py-2 text-left text-xs sm:text-sm text-fb-text-secondary transition-colors">
          {t('home.writeComment')}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
