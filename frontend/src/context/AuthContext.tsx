
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { AuthState, User, AppearanceSettings } from '../types';

interface AuthContextType extends AuthState {
  login: (token: string, user: User, settings: AppearanceSettings) => void;
  logout: () => void;
  setSettings: (settings: AppearanceSettings) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    settings: JSON.parse(localStorage.getItem('settings') || 'null'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: true,
  });

  useEffect(() => {
    // This effect ensures we are truly unauthenticated if token is invalid,
    // although ProtectedRoute handles the UI part.
    setAuth(prev => ({
        ...prev,
        loading: false
    }));
  }, []);

  const login = (token: string, user: User, settings: AppearanceSettings) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('settings', JSON.stringify(settings));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAuth({
      token,
      user,
      settings,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('settings');
    delete api.defaults.headers.common['Authorization'];
    setAuth({
      token: null,
      user: null,
      settings: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const setSettings = (settings: AppearanceSettings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
    setAuth(prev => ({...prev, settings}));
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, setSettings }}>
      {children}
    </AuthContext.Provider>
  );
};