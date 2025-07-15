
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    // In a real app, you'd have a role property on the user object
    const isDemoUser = user?.username === 'demo';

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark">{t('adminTitle')}</h1>
            <p className="mt-2 text-gray-600">{t('adminSubtitle')}</p>

            <Card className="mt-8">
                <h2 className="text-xl font-semibold text-brand-dark mb-4">{t('adminAppearanceTitle')}</h2>
                
                {isDemoUser ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Lock className="w-12 h-12 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-bold text-yellow-800">{t('adminDemoDisabled')}</h3>
                        <p className="text-yellow-700 text-center mt-2">{t('adminComingSoon')}</p>
                    </div>
                ) : (
                    <div>
                        {/* Placeholder for actual admin controls */}
                        <p className="text-gray-500">{t('adminComingSoon')}</p>
                    </div>
                )}
            </Card>
        </div>
    );
};
