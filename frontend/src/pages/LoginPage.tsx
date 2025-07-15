
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useAppearance } from '../context/AppearanceContext';
import { useTranslation } from 'react-i18next';

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const { appName } = useAppearance();
    const { t } = useTranslation();
    const [username, setUsername] = useState('demo');
    const [password, setPassword] = useState('demo');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-primary to-teal-600">
            <Card className="w-full max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-brand-dark">{appName}</h1>
                    <p className="mt-2 text-gray-600">{t('loginTitle')}</p>
                    <p className="mt-4 text-sm bg-yellow-100 text-yellow-800 p-2 rounded-md">
                        {t('loginDemoHint')}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <Input id="username" label={t('loginUserLabel')} type="text" placeholder="demo" required value={username} onChange={e => setUsername(e.target.value)} />
                    <Input id="password" label={t('loginPasswordLabel')} type="password" placeholder="demo" required value={password} onChange={e => setPassword(e.target.value)} />
                    
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    
                    <div>
                        <Button type="submit" className="w-full flex justify-center">
                            {t('loginButton')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
