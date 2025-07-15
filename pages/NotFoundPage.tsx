
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-brand-light text-center">
      <AlertTriangle className="w-24 h-24 text-brand-secondary mb-4" />
      <h1 className="text-6xl font-bold text-brand-dark">404</h1>
      <p className="text-2xl text-gray-700 mt-2">Página no encontrada</p>
      <p className="text-gray-500 mt-4">La página que buscas no existe o ha sido movida.</p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary/90 transition-colors"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
};
