
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';
import { AppearanceSettings } from '../types';
import api from '../services/api';

interface AppearanceContextType {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'es';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setLanguage: (language: 'en' | 'es') => void;
}

export const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const AppearanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { settings, setSettings, isAuthenticated } = useAuth();
    const { i18n } = useTranslation();

    const theme = settings?.theme ?? 'system';
    const language = settings?.language ?? 'en';

    useEffect(() => {
        const root = window.document.documentElement;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        root.classList.remove('light', 'dark');
        
        if (theme === 'system') {
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);
    
    useEffect(() => {
        if(i18n.language !== language){
            i18n.changeLanguage(language);
        }
    }, [language, i18n]);

    const updateSettings = async (newSettings: Partial<AppearanceSettings>) => {
        if(isAuthenticated && settings) {
            const updated = {...settings, ...newSettings };
            setSettings(updated); // Optimistic update
            try {
                await api.put('/user/settings/appearance', newSettings);
            } catch (error) {
                console.error("Failed to update settings", error);
                // Optionally revert settings
            }
        }
    }

    const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
        updateSettings({ theme: newTheme });
    }

    const setLanguage = (newLanguage: 'en' | 'es') => {
        updateSettings({ language: newLanguage });
    }


    return (
        <AppearanceContext.Provider value={{ theme, language, setTheme, setLanguage }}>
            {children}
        </AppearanceContext.Provider>
    );
};