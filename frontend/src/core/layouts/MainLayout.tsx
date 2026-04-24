import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useAuthStore } from '../store/authStore';
import { AppConfig } from '../config/app.config';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">{AppConfig.appName}</span>
              <div className="ml-10 flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LayoutDashboard size={20} />
                  <span>{t('navigation.dashboard')}</span>
                </Link>
                <Link
                  to="/users"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Users size={20} />
                  <span>{t('navigation.users')}</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
                >
                  <LogOut size={20} />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
