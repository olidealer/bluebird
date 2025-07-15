
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface AppearanceSettings {
  appName: string;
  logoUrl: string;
  primaryColor: string;
}

const AppearanceContext = createContext<AppearanceSettings | null>(null);

export const AppearanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppearanceSettings | null>(null);

    useEffect(() => {
        const fetchAppearance = async () => {
            try {
                const { data } = await api.get('/settings/appearance');
                setSettings(data);
                // Apply theme colors as CSS variables
                document.documentElement.style.setProperty('--color-primary', data.primaryColor);
            } catch (error) {
                console.error('Failed to fetch appearance settings:', error);
                // Set fallback defaults
                const fallbackColor = '#007A87';
                document.documentElement.style.setProperty('--color-primary', fallbackColor);
                setSettings({
                    appName: "Rental Property Tax",
                    logoUrl: "/logo.svg",
                    primaryColor: fallbackColor
                });
            }
        };
        fetchAppearance();
    }, []);

    if (!settings) {
        // You could return a global loading spinner here
        return null;
    }

    return (
        <AppearanceContext.Provider value={settings}>
            {children}
        </AppearanceContext.Provider>
    );
};

export const useAppearance = (): AppearanceSettings => {
    const context = useContext(AppearanceContext);
    if (!context) {
        throw new Error('useAppearance must be used within an AppearanceProvider');
    }
    return context;
};
