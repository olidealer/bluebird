
import React from 'react';
import { Bell, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="flex items-center justify-between h-20 px-6 py-4 bg-white border-b-2 border-gray-200">
            <div>
                 <h2 className="text-2xl font-semibold text-gray-800">{t('headerWelcome')}</h2>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none">
                        <Languages size={24} />
                    </button>
                    <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block hover:block">
                        <button onClick={() => changeLanguage('es')} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Español</button>
                        <button onClick={() => changeLanguage('en')} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English</button>
                    </div>
                </div>

                <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none">
                    <span className="sr-only">View notifications</span>
                    <Bell size={24} />
                    <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div>
                    <img className="h-10 w-10 rounded-full object-cover" src="https://i.pravatar.cc/100" alt="user avatar" />
                </div>
            </div>
        </header>
    );
};
