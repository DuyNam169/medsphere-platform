import React from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '../../../core/layouts';
import { Card } from '../../../core/components';
import { Users, BarChart3, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('navigation.users'),
      value: '1,234',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Analytics',
      value: '89%',
      icon: BarChart3,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Growth',
      value: '+23%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('navigation.dashboard')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={stat.color} size={32} />
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('app.welcome')}</h2>
          <p className="text-gray-600">
            This is a scalable modular architecture with i18n support. Switch between English and Vietnamese using the language toggle in the navigation bar.
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};
