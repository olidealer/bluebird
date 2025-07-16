import React from 'react';
import { Sun, Moon, Monitor, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';
import useAppearance from '../hooks/useAppearance';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme, language, setLanguage } = useAppearance();
  const { t } = useTranslation();

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 p-4 bg-card border-b border-border shadow-sm">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-card-foreground text-center sm:text-left">{t('header.welcome')}, {user?.username}</h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Language Switcher */}
        <div className="flex items-center p-1 rounded-md bg-muted">
          <button onClick={() => setLanguage('en')} className={`px-2 py-1 text-xs sm:text-sm rounded ${language === 'en' ? 'bg-background shadow' : ''}`}>EN</button>
          <button onClick={() => setLanguage('es')} className={`px-2 py-1 text-xs sm:text-sm rounded ${language === 'es' ? 'bg-background shadow' : ''}`}>ES</button>
        </div>

        {/* Theme Switcher */}
        <div className="flex items-center p-1 rounded-md bg-muted">
            <button onClick={() => setTheme('light')} className={`p-1 rounded ${theme === 'light' ? 'bg-background shadow' : ''}`} aria-label={t('theme.light')}><Sun size={18}/></button>
            <button onClick={() => setTheme('dark')} className={`p-1 rounded ${theme === 'dark' ? 'bg-background shadow' : ''}`} aria-label={t('theme.dark')}><Moon size={18}/></button>
            <button onClick={() => setTheme('system')} className={`p-1 rounded ${theme === 'system' ? 'bg-background shadow' : ''}`} aria-label={t('theme.system')}><Monitor size={18}/></button>
        </div>

        <button
          onClick={logout}
          className="flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-md text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-colors"
          aria-label={t('header.logout')}
        >
          <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t('header.logout')}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
