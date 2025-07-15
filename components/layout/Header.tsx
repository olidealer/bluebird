
import React from 'react';
import { Bell } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between h-20 px-6 py-4 bg-white border-b-2 border-gray-200">
            <div>
                 <h2 className="text-2xl font-semibold text-gray-800">Bienvenido, Anfitrión</h2>
            </div>
            <div className="flex items-center">
                <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:text-gray-600 focus:bg-gray-100">
                    <span className="sr-only">View notifications</span>
                    <Bell size={24} />
                    <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="ml-4">
                    <img className="h-10 w-10 rounded-full object-cover" src="https://picsum.photos/100" alt="user avatar" />
                </div>
            </div>
        </header>
    );
};
