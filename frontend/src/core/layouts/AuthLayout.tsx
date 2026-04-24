import React from 'react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { AppConfig } from '../config/app.config';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">{AppConfig.appName}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};
