
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileArchive, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppearance } from '../../context/AppearanceContext';
import { useTranslation } from 'react-i18next';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => (
    <NavLink
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
            `flex items-center px-4 py-3 text-gray-200 transition-colors duration-200 transform rounded-lg hover:bg-gray-700 ${
                isActive ? 'bg-gray-700 font-semibold' : 'hover:bg-opacity-50'
            }`
        }
    >
        {icon}
        <span className="mx-4 font-medium">{text}</span>
    </NavLink>
);


export const Sidebar: React.FC = () => {
    const { logout } = useAuth();
    const { appName, logoUrl } = useAppearance();
    const { t } = useTranslation();
    
    return (
        <div className="flex flex-col w-64 bg-brand-dark text-white">
            <div className="flex items-center justify-center h-20 border-b border-gray-700 px-4">
                 <img src={logoUrl} alt="App Logo" className="h-8 w-8 mr-2"/>
                <h1 className="text-xl font-bold text-center">{appName}</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                <NavItem to="/" icon={<Home size={20} />} text={t('sidebarDashboard')} />
                <NavItem to="/generated-pdfs" icon={<FileArchive size={20} />} text={t('sidebarGeneratedPDFs')} />
                <NavItem to="/profile" icon={<User size={20} />} text={t('sidebarProfile')} />
                <NavItem to="/admin" icon={<Shield size={20} />} text={t('sidebarAdmin')} />
            </nav>
            <div className="px-2 py-4 border-t border-gray-700">
                 <button 
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-gray-200 transition-colors duration-200 transform rounded-lg hover:bg-brand-secondary hover:text-white"
                 >
                    <LogOut size={20} />
                    <span className="mx-4 font-medium">{t('sidebarLogout')}</span>
                </button>
            </div>
        </div>
    );
};
