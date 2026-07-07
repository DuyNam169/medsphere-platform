// ============================================================
// SvgIcon.tsx — src/core/icons/SvgIcon.tsx
// Global SVG icon wrapper.
// Cách dùng: <SvgIcon name="IconHome" size={24} color="#1877F2" />
//
// Icon "core" (dùng chung toàn app) import qua barrel
// '../assets/icons' — đây là NGUỒN DUY NHẤT khai báo icon core.
// Muốn thêm icon mới: chỉ cần thêm export trong
// core/assets/icons/index.ts, KHÔNG cần sửa gì thêm ở đây
// ngoài 3 dòng bên dưới (import, wrap, ICON_MAP).
// ============================================================

import React from 'react';
import * as CoreIcons from '../assets/icons';

// ── Auth package icons (khác barrel, thuộc package riêng) ──
import _IconLock   from '../../packages/auth/assets/icons/IconLock.svg?component';
import _IconEye    from '../../packages/auth/assets/icons/IconEye.svg?component';
import _IconEyeOff from '../../packages/auth/assets/icons/IconEyeOff.svg?component';
import _IconGoogle from '../../packages/auth/assets/icons/IconGoogle.svg?component';
import _IconMail   from '../../packages/auth/assets/icons/IconMail.svg?component';
import _IconPhone  from '../../packages/auth/assets/icons/IconPhone.svg?component';
import _IconShield from '../../packages/auth/assets/icons/IconShield.svg?component';

const IconLock:    React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconLock {...p} />;
const IconEye:     React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconEye {...p} />;
const IconEyeOff:  React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconEyeOff {...p} />;
const IconGoogle:  React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconGoogle {...p} />;
const IconMail:    React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconMail {...p} />;
const IconPhone:   React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconPhone {...p} />;
const IconShield:  React.FC<React.SVGProps<SVGSVGElement>> = (p) => <_IconShield {...p} />;

// ── Icon registry ─────────────────────────────────────────
// Icon "core" lấy trực tiếp từ barrel — thêm icon mới ở đó là tự
// động có mặt tại đây, không cần import thủ công từng file nữa.
const ICON_MAP = {
  ...CoreIcons,
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
  const IconComponent = ICON_MAP[name] as React.FC<React.SVGProps<SVGSVGElement>>;

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