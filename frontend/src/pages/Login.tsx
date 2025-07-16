import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { username, password });
      login(data.token, { id: data.id, username: data.username }, data.settings);
      navigate('/');
    } catch (err) {
      setError(t('login.error'));
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-card rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-card-foreground">{t('login.title')}</h1>
        {error && <p className="text-center text-destructive">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-muted-foreground">{t('login.username')}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">{t('login.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t('login.button')}
          </button>
        </form>
        <p className="text-sm text-center text-muted-foreground">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            {t('login.register')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
