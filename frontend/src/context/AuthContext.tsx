
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    isAuthenticated: boolean;
    user: { id: string; username: string; } | null;
    isLoading: boolean;
    login: (user: string, pass: string) => Promise<void>;
    logout: () => void;
}

interface DecodedToken {
    id: string;
    username: string;
    exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ id: string; username: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                // Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({ id: decoded.id, username: decoded.username || 'demo' });
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } else {
                    // Token expired, clear it
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Invalid token");
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, pass: string): Promise<void> => {
        const { data } = await api.post('/auth/login', { username, password: pass });
        if (data.token) {
            localStorage.setItem('token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser({ id: data.id, username: data.username });
            navigate('/');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        navigate('/login');
    };

    const value = {
        isAuthenticated: !!user,
        user,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
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
