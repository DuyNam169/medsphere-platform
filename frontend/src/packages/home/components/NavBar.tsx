import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import SvgIcon from '../../../core/icons/SvgIcon';
import { AppConfig } from '../../../core/config/app.config';
import { useAuthStore } from '../../../core/store/authStore';

interface NavBarProps { onRequireLogin: () => void; }
type NavTab = 'home' | 'ai' | 'marketplace' | 'groups' | 'gaming';

const NAV_ICON_COLOR = '#1E3A5F';

const NavBar: React.FC<NavBarProps> = ({ onRequireLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync activeTab với route hiện tại
  const getActiveTab = (): NavTab => {
    if (location.pathname === '/ai') return 'ai';
    if (location.pathname === '/') return 'home';
    return 'home';
  };
  const activeTab = getActiveTab();

  const soon = () => alert(`⏳ ${t('common.comingSoon')}\n\n${t('common.comingSoonMessage')}`);

  const navTabs: { key: NavTab; icon: React.ComponentProps<typeof SvgIcon>['name']; label: string }[] = [
    { key: 'home',        icon: 'IconHome',        label: t('navigation.home') },
    { key: 'ai',          icon: 'IconAI',           label: 'AI' },
    { key: 'marketplace', icon: 'IconMarketplace',  label: t('navigation.marketplace') },
    { key: 'groups',      icon: 'IconGroups',       label: t('navigation.groups') },
    { key: 'gaming',      icon: 'IconGaming',       label: t('navigation.gaming') },
  ];

  const handleTabClick = (tab: NavTab) => {
    if (tab === 'home') {
      navigate('/');
    } else if (tab === 'ai') {
      navigate('/ai');
    } else {
      soon();
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setProfileMenuOpen((prev) => !prev);
    } else {
      onRequireLogin();
    }
  };

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-fb-bg-card shadow-sm">
      <div className="relative h-14 flex items-center px-2 sm:px-4">

        {/* LEFT: Logo + Search */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a href="/" aria-label={AppConfig.brandName} className="flex-shrink-0">
            <img src="/src/core/assets/logo.svg" alt="Medsphere" className="h-11 w-11" />
          </a>
          <button
            onClick={soon}
            className="hidden sm:flex items-center gap-2 bg-fb-bg-input hover:bg-fb-bg-hover-dark rounded-full px-3 py-2 text-fb-text-secondary text-sm transition-colors md:w-[240px]"
            aria-label={t('home.searchPlaceholder')}
          >
            <SvgIcon name="IconSearch" size={16} color={NAV_ICON_COLOR} />
            <span className="hidden md:inline">{t('home.searchPlaceholder')}</span>
          </button>
          <button
            onClick={soon}
            className="sm:hidden w-9 h-9 rounded-full bg-fb-bg-input flex items-center justify-center"
            aria-label={t('home.searchPlaceholder')}
          >
            <SvgIcon name="IconSearch" size={18} color={NAV_ICON_COLOR} />
          </button>
        </div>

        {/* CENTER: Nav Tabs — absolute center */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              title={tab.label}
              className="relative flex items-center justify-center px-5 xl:px-8 h-12 rounded-lg transition-colors hover:bg-fb-bg-hover"
            >
              <SvgIcon name={tab.icon} size={24} color={NAV_ICON_COLOR} />
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-fb-primary rounded-t-sm" />
              )}
            </button>
          ))}
        </nav>

        {/* RIGHT: Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-auto">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-fb-icon-bg hover:bg-fb-bg-pressed flex items-center justify-center transition-colors"
            aria-label={t('navigation.menu')}
          >
            <SvgIcon name="IconMenu" size={20} color={NAV_ICON_COLOR} />
          </button>

          <button
            onClick={soon}
            className="hidden md:flex w-10 h-10 rounded-full bg-fb-icon-bg hover:bg-fb-bg-pressed items-center justify-center transition-colors"
            title={t('navigation.menu')}
          >
            <SvgIcon name="IconMenu" size={20} color={NAV_ICON_COLOR} />
          </button>

          <button
            onClick={onRequireLogin}
            className="relative w-10 h-10 rounded-full bg-fb-icon-bg hover:bg-fb-bg-pressed flex items-center justify-center transition-colors"
            title="Messenger"
          >
            <SvgIcon name="IconMessenger" size={20} color={NAV_ICON_COLOR} />
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-fb-badge text-white rounded-full text-[10px] font-bold flex items-center justify-center px-0.5">
              3
            </span>
          </button>

          <button
            onClick={onRequireLogin}
            className="relative w-10 h-10 rounded-full bg-fb-icon-bg hover:bg-fb-bg-pressed flex items-center justify-center transition-colors"
            title="Notifications"
          >
            <SvgIcon name="IconBell" size={20} color={NAV_ICON_COLOR} />
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-fb-badge text-white rounded-full text-[10px] font-bold flex items-center justify-center px-0.5">
              9+
            </span>
          </button>

          {/* Account button + dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={handleAccountClick}
              className="w-10 h-10 rounded-full bg-fb-icon-bg hover:bg-fb-bg-pressed flex items-center justify-center transition-colors overflow-hidden"
              title="Account"
            >
              {isAuthenticated && user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <SvgIcon name="IconUser" size={20} color={NAV_ICON_COLOR} />
              )}
            </button>

            {profileMenuOpen && isAuthenticated && (
              <div className="absolute right-0 top-12 w-64 bg-fb-bg-card rounded-xl shadow-lg border border-fb-border py-2 z-50">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-9 h-9 rounded-full bg-fb-icon-bg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <SvgIcon name="IconUser" size={18} color={NAV_ICON_COLOR} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-fb-text-primary truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-fb-text-secondary truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="my-1 border-t border-fb-border" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-fb-bg-hover transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-fb-icon-bg flex items-center justify-center flex-shrink-0">
                    <SvgIcon name="IconLogOut" size={16} color={NAV_ICON_COLOR} />
                  </span>
                  <span className="text-sm font-medium text-fb-text-primary">
                    {t('navigation.logout')}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-fb-bg-card border-t border-fb-border px-4 py-2">
          <div className="flex justify-around">
            {navTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { handleTabClick(tab.key); setMobileMenuOpen(false); }}
                className="relative flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-fb-bg-hover"
              >
                <SvgIcon name={tab.icon} size={22} color={NAV_ICON_COLOR} />
                <span className="text-[10px] font-medium" style={{ color: NAV_ICON_COLOR }}>{tab.label}</span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-fb-primary rounded-t-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;