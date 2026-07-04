// ============================================================
// BrandPanel.tsx — src/packages/auth/components/BrandPanel.tsx
// Left panel: doctor hero image + glassmorphism overlay.
// Icons dùng qua SvgIcon từ core — không import SVG trực tiếp.
// ============================================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppConfig } from '../../../core/config/app.config';
import { SvgIcon } from '../../../core/icons';
import doctorImg from '../assets/images/doctor.jpg';
import logoSvg from '../../../core/assets/logo/logo.svg';

const features = [
  {
    icon: <SvgIcon name="IconHeart"     size={18} color="#fff" aria-hidden />,
    key: 'featureHealth',
  },
  {
    icon: <SvgIcon name="IconSearch"    size={18} color="#fff" aria-hidden />,
    key: 'featureAI',
  },
  {
    icon: <SvgIcon name="IconUser"      size={18} color="#fff" aria-hidden />,
    key: 'featureConnect',
  },
] as const;

export const BrandPanel: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="brand-panel">
      {/* Dot grid decoration */}
      <div className="brand-panel__grid" aria-hidden="true" />

      {/* Hero image — fills the full panel */}
      <img
        src={doctorImg}
        alt=""
        className="brand-panel__hero-img"
        aria-hidden="true"
      />

      {/* Dark gradient overlay so text stays readable */}
      <div className="brand-panel__overlay" aria-hidden="true" />

      {/* Top: logo + wordmark */}
      <div className="brand-panel__header">
        <div className="brand-panel__wordmark">
          <img
            src={logoSvg}
            alt=""
            className="brand-panel__logo"
            aria-hidden="true"
          />
          <span className="brand-panel__name">{AppConfig.brandName}</span>
        </div>
        <p className="brand-panel__tagline">{t('auth.brandTagline')}</p>
      </div>

      {/* Spacer */}
      <div className="brand-panel__spacer" />

      {/* Bottom: feature cards */}
      <ul className="brand-panel__features">
        {features.map(({ icon, key }) => (
          <li key={key} className="brand-panel__feature">
            <span className="brand-panel__feature-icon">{icon}</span>
            <span className="brand-panel__feature-text">{t(`auth.${key}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};