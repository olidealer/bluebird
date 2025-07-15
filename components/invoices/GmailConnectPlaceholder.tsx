
import React from 'react';
import { Mail } from 'lucide-react';

export const GmailConnectPlaceholder: React.FC = () => {
    return (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="flex items-center">
                <Mail className="w-8 h-8 text-gray-400 mr-4" />
                <div>
                    <h4 className="font-semibold text-gray-800">Conectar con Gmail</h4>
                    <p className="text-sm text-gray-500">
                        Próximamente: Importa facturas automáticamente desde tu correo. Esta función requiere configuración del lado del servidor.
                    </p>
                </div>
                <button
                    disabled
                    className="ml-auto px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-semibold cursor-not-allowed"
                >
                    Conectar
                </button>
            </div>
        </div>
    );
};
