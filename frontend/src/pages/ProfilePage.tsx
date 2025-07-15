
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({ username: '', email: '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/user/profile');
                setProfileData({ username: data.username, email: data.email });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);
        try {
            await api.put('/user/profile', profileData);
            setFeedback({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error: any) {
            setFeedback({ type: 'error', message: error.response?.data?.message || 'Failed to update profile.' });
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);
        try {
            await api.put('/user/change-password', passwordData);
            setFeedback({ type: 'success', message: 'Password updated successfully!' });
            setPasswordData({ oldPassword: '', newPassword: '' });
        } catch (error: any) {
            setFeedback({ type: 'error', message: error.response?.data?.message || 'Failed to update password.' });
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark">{t('profileTitle')}</h1>
            <p className="mt-2 text-gray-600">{t('profileSubtitle')}</p>

            {feedback && (
                <div className={`mt-4 p-3 rounded-md text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Card>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <Input
                            id="username"
                            name="username"
                            label={t('profileUsernameLabel')}
                            value={profileData.username}
                            onChange={handleProfileChange}
                            required
                        />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label={t('profileEmailLabel')}
                            value={profileData.email}
                            onChange={handleProfileChange}
                            required
                        />
                        <Button type="submit">{t('profileSaveButton')}</Button>
                    </form>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold text-brand-dark mb-4">{t('changePasswordTitle')}</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                         <Input
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            label={t('oldPasswordLabel')}
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                         <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            label={t('newPasswordLabel')}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        <Button type="submit">{t('changePasswordButton')}</Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};
