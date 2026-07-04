// ============================================================
// SvgIcon.tsx — src/core/icons/SvgIcon.tsx
// Global SVG icon wrapper.
// Cách dùng: <SvgIcon name="IconHome" size={24} color="#1877F2" />
// ============================================================

import React from 'react';

// ── Core icons (shared toàn app) ──────────────────────────
import _IconFacebookLogo     from '../assets/icons/IconFacebookLogo.svg?component';
import _IconFacebookWordmark from '../assets/icons/IconFacebookWordmark.svg?component';
import _IconHome             from '../assets/icons/IconHome.svg?component';
import _IconWatch            from '../assets/icons/IconWatch.svg?component';
import _IconMarketplace      from '../assets/icons/IconMarketplace.svg?component';
import _IconGroups           from '../assets/icons/IconGroups.svg?component';
import _IconGaming           from '../assets/icons/IconGaming.svg?component';
import _IconMessenger        from '../assets/icons/IconMessenger.svg?component';
import _IconBell             from '../assets/icons/IconBell.svg?component';
import _IconSearch           from '../assets/icons/IconSearch.svg?component';
import _IconUser             from '../assets/icons/IconUser.svg?component';
import _IconCamera           from '../assets/icons/IconCamera.svg?component';
import _IconVideoCamera      from '../assets/icons/IconVideoCamera.svg?component';
import _IconThumbUp          from '../assets/icons/IconThumbUp.svg?component';
import _IconHeart            from '../assets/icons/IconHeart.svg?component';
import _IconComment          from '../assets/icons/IconComment.svg?component';
import _IconShare            from '../assets/icons/IconShare.svg?component';
import _IconEmoji            from '../assets/icons/IconEmoji.svg?component';
import _IconClose            from '../assets/icons/IconClose.svg?component';
import _IconArrowDown        from '../assets/icons/IconArrowDown.svg?component';
import _IconGlobe            from '../assets/icons/IconGlobe.svg?component';
import _IconLocation         from '../assets/icons/IconLocation.svg?component';
import _IconEvents           from '../assets/icons/IconEvents.svg?component';
import _IconFriends          from '../assets/icons/IconFriends.svg?component';
import _IconMenu             from '../assets/icons/IconMenu.svg?component';
import _IconMoreHoriz        from '../assets/icons/IconMoreHoriz.svg?component';
import _IconMemories         from '../assets/icons/IconMemories.svg?component';
import _IconSaved            from '../assets/icons/IconSaved.svg?component';
import _IconAI               from '../assets/icons/IconAI.svg?component';
import _IconTag              from '../assets/icons/IconTag.svg?component';
import _IconSettings         from '../assets/icons/IconSettings.svg?component';

// ── Auth package icons ────────────────────────────────────
import _IconLock   from '../../packages/auth/assets/icons/IconLock.svg?component';
import _IconEye    from '../../packages/auth/assets/icons/IconEye.svg?component';
import _IconEyeOff from '../../packages/auth/assets/icons/IconEyeOff.svg?component';
import _IconGoogle from '../../packages/auth/assets/icons/IconGoogle.svg?component';
import _IconMail   from '../../packages/auth/assets/icons/IconMail.svg?component';
import _IconPhone  from '../../packages/auth/assets/icons/IconPhone.svg?component';
import _IconShield from '../../packages/auth/assets/icons/IconShield.svg?component';

// ── Wrap với tên PascalCase để React không warn casing ────
// React xác định component qua tên biến — đặt đúng PascalCase
// giải quyết warning "incorrect casing" trong dev mode.
const IconFacebookLogo:     React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconFacebookLogo {...p} />;
const IconFacebookWordmark: React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconFacebookWordmark {...p} />;
const IconHome:             React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconHome {...p} />;
const IconWatch:            React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconWatch {...p} />;
const IconMarketplace:      React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconMarketplace {...p} />;
const IconGroups:           React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconGroups {...p} />;
const IconGaming:           React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconGaming {...p} />;
const IconMessenger:        React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconMessenger {...p} />;
const IconBell:             React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconBell {...p} />;
const IconSearch:           React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconSearch {...p} />;
const IconUser:             React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconUser {...p} />;
const IconCamera:           React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconCamera {...p} />;
const IconVideoCamera:      React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconVideoCamera {...p} />;
const IconThumbUp:          React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconThumbUp {...p} />;
const IconHeart:            React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconHeart {...p} />;
const IconComment:          React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconComment {...p} />;
const IconShare:            React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconShare {...p} />;
const IconEmoji:            React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconEmoji {...p} />;
const IconClose:            React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconClose {...p} />;
const IconArrowDown:        React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconArrowDown {...p} />;
const IconGlobe:            React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconGlobe {...p} />;
const IconLocation:         React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconLocation {...p} />;
const IconEvents:           React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconEvents {...p} />;
const IconFriends:          React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconFriends {...p} />;
const IconMenu:             React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconMenu {...p} />;
const IconMoreHoriz:        React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconMoreHoriz {...p} />;
const IconMemories:         React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconMemories {...p} />;
const IconSaved:            React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconSaved {...p} />;
const IconAI:               React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconAI {...p} />;
const IconTag:              React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconTag {...p} />;
const IconSettings:         React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconSettings {...p} />;
const IconLock:             React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconLock {...p} />;
const IconEye:              React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconEye {...p} />;
const IconEyeOff:           React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconEyeOff {...p} />;
const IconGoogle:           React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconGoogle {...p} />;
const IconMail:             React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconMail {...p} />;
const IconPhone:            React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconPhone {...p} />;
const IconShield:           React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconShield {...p} />;

// ── Icon registry ─────────────────────────────────────────
const ICON_MAP = {
  IconFacebookLogo,
  IconFacebookWordmark,
  IconHome,
  IconWatch,
  IconMarketplace,
  IconGroups,
  IconGaming,
  IconMessenger,
  IconBell,
  IconSearch,
  IconUser,
  IconCamera,
  IconVideoCamera,
  IconThumbUp,
  IconHeart,
  IconComment,
  IconShare,
  IconEmoji,
  IconClose,
  IconArrowDown,
  IconGlobe,
  IconLocation,
  IconEvents,
  IconFriends,
  IconMenu,
  IconMoreHoriz,
  IconMemories,
  IconSaved,
  IconAI,
  IconTag,
  IconSettings,
  IconLock,
  IconEye,
  IconEyeOff,
  IconGoogle,
  IconMail,
  IconPhone,
  IconShield,
} as const;

export type IconName = keyof typeof ICON_MAP;

// ── Props ─────────────────────────────────────────────────
interface SvgIconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

// ── Component ─────────────────────────────────────────────
export const SvgIcon: React.FC<SvgIconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  className,
  style,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}) => {
  const IconComponent = ICON_MAP[name];

  if (!IconComponent) {
    if (import.meta.env.DEV) {
      console.warn(`[SvgIcon] Icon "${name}" not found in registry.`);
    }
    return null;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      fill={color}
      className={className}
      style={style}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
      role={ariaLabel ? 'img' : undefined}
    />
  );
};

export default SvgIcon;