import { facebookColors } from './src/core/theme/colors.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-fb-icon-profile',
    'bg-fb-icon-friends',
    'bg-fb-icon-memories',
    'bg-fb-icon-saved',
    'bg-fb-icon-groups',
    'bg-fb-icon-watch',
    'bg-fb-icon-market',
    'bg-fb-icon-events',
    'bg-fb-icon-gaming',
    'bg-fb-icon-pages',
    'bg-fb-icon-settings',
  ],
  theme: {
    extend: {
      colors: {
        'fb-primary':          facebookColors.primary,
        'fb-primary-hover':    facebookColors.primaryHover,
        'fb-primary-light':    facebookColors.primaryLight,
        'fb-primary-text':     facebookColors.primaryText,

        'fb-bg-page':          facebookColors.bgPage,
        'fb-bg-card':          facebookColors.bgCard,
        'fb-bg-input':         facebookColors.bgInput,
        'fb-bg-hover':         facebookColors.bgHover,
        'fb-bg-hover-dark':    facebookColors.bgHoverDark,
        'fb-bg-pressed':       facebookColors.bgPressed,

        'fb-text':             facebookColors.textPrimary,
        'fb-text-secondary':   facebookColors.textSecondary,
        'fb-text-link':        facebookColors.textLink,
        'fb-text-white':       facebookColors.textWhite,

        'fb-border':           facebookColors.border,
        'fb-border-input':     facebookColors.borderInput,
        'fb-border-focus':     facebookColors.borderFocus,

        'fb-icon-bg':          facebookColors.iconBg,

        'fb-badge':            facebookColors.badgeBg,
        'fb-badge-text':       facebookColors.badgeText,

        'fb-reaction-like':    facebookColors.reactionLike,
        'fb-reaction-love':    facebookColors.reactionLove,
        'fb-reaction-haha':    facebookColors.reactionHaha,
        'fb-reaction-wow':     facebookColors.reactionWow,
        'fb-reaction-sad':     facebookColors.reactionSad,
        'fb-reaction-angry':   facebookColors.reactionAngry,

        'fb-icon-profile':     facebookColors.iconProfile,
        'fb-icon-friends':     facebookColors.iconFriends,
        'fb-icon-memories':    facebookColors.iconMemories,
        'fb-icon-saved':       facebookColors.iconSaved,
        'fb-icon-groups':      facebookColors.iconGroups,
        'fb-icon-watch':       facebookColors.iconWatch,
        'fb-icon-market':      facebookColors.iconMarket,
        'fb-icon-events':      facebookColors.iconEvents,
        'fb-icon-gaming':      facebookColors.iconGaming,
        'fb-icon-pages':       facebookColors.iconPages,
        'fb-icon-settings':    facebookColors.iconSettings,

        'fb-btn-primary':      facebookColors.btnPrimary,
        'fb-btn-primary-hov':  facebookColors.btnPrimaryHov,
        'fb-btn-success':      facebookColors.btnSuccess,
        'fb-btn-success-hov':  facebookColors.btnSuccessHov,
        'fb-btn-neutral':      facebookColors.btnNeutral,
        'fb-btn-neutral-hov':  facebookColors.btnNeutralHov,

        'fb-online':           facebookColors.online,
      },
    },
  },
  plugins: [],
};