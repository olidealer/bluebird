import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (user: string, pass: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_USER = { user: 'demo', pass: 'demo' };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return sessionStorage.getItem('isAuthenticated') === 'true';
    });
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem('isAuthenticated', String(isAuthenticated));
    }, [isAuthenticated]);

    const login = async (user: string, pass: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (user === FAKE_USER.user && pass === FAKE_USER.pass) {
                    setIsAuthenticated(true);
                    navigate('/');
                    resolve();
                } else {
                    reject(new Error('Usuario o contraseña incorrectos.'));
                }
            }, 500); // Simulate network delay
        });
    };

    const logout = () => {
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
