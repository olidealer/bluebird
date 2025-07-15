import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileArchive, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => (
    <NavLink
        to={to}
        end // Use 'end' for the dashboard link to not match other routes
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
    
    return (
        <div className="flex flex-col w-64 bg-brand-dark text-white">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                <h1 className="text-2xl font-bold">Rental Property Tax</h1>
            </div>
            <nav className="flex-1 px-2 py-4">
                <NavItem to="/" icon={<Home size={20} />} text="Dashboard" />
                <NavItem to="/generated-pdfs" icon={<FileArchive size={20} />} text="PDFs Generados" />
            </nav>
            <div className="px-2 py-4 border-t border-gray-700">
                 <button 
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-gray-200 transition-colors duration-200 transform rounded-lg hover:bg-brand-secondary hover:text-white"
                 >
                    <LogOut size={20} />
                    <span className="mx-4 font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};