
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { AuthProvider } from './context/AuthContext.tsx';
import { AppearanceProvider } from './context/AppearanceContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </AuthProvider>
  </React.StrictMode>,
)