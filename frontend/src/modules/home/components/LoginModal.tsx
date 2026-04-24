// ============================================================
// LoginModal.tsx — Modal login/signup
// Màu từ fb-* tokens. Responsive.
// MARK: API: POST /api/auth/login → { user, token }
// ============================================================
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SvgIcon from '../../../core/icons/SvgIcon';
import { AppConfig } from '../../../core/config/app.config';

interface LoginModalProps { isOpen: boolean; onClose: () => void; }

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // MARK: Thay bằng: await authService.login({ email, password });
    navigate('/login');
  };

  const handleSignup = () => {
    alert(`⏳ ${t('common.comingSoon')}\n\n${t('common.comingSoonMessage')}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-fb-bg-card rounded-2xl shadow-2xl w-full max-w-[432px] overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-fb-border flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-fb-primary">{AppConfig.brandName}</h2>
            <p className="text-fb-text-secondary text-xs sm:text-sm mt-1">{t('home.loginModalSubtitle')}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-fb-icon-bg hover:bg-fb-bg-pressed flex items-center justify-center transition-colors flex-shrink-0">
            <SvgIcon name="IconClose" size={18} color="#65676B" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-4 sm:p-6 flex flex-col gap-3">
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('auth.phone')}
            className="w-full border border-fb-border-input rounded-lg px-4 py-3 text-sm text-fb-text placeholder-fb-text-secondary focus:outline-none focus:border-fb-primary focus:ring-2 focus:ring-fb-primary/20 transition-all"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t('auth.passwordLabel')}
            className="w-full border border-fb-border-input rounded-lg px-4 py-3 text-sm text-fb-text placeholder-fb-text-secondary focus:outline-none focus:border-fb-primary focus:ring-2 focus:ring-fb-primary/20 transition-all"
          />

          <button type="submit" className="w-full bg-fb-btn-primary hover:bg-fb-primary-hover text-white font-semibold py-3 rounded-lg text-base sm:text-lg transition-colors">
            {t('home.loginModalLogin')}
          </button>

          <button type="button" onClick={() => alert(`⏳ ${t('common.comingSoon')}\n\n${t('common.comingSoonMessage')}`)}
            className="text-sm text-fb-primary hover:underline text-center py-0.5">
            {t('auth.forgotPassword')}
          </button>

          <div className="h-[1px] bg-fb-border my-1" />

          <button type="button" onClick={handleSignup}
            className="mx-auto bg-fb-btn-success hover:bg-fb-btn-success/90 text-white font-semibold py-3 px-6 rounded-lg text-base transition-colors">
            {t('home.loginModalSignup')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
