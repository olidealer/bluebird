import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    try {
      const { data } = await api.post('/auth/register', { username, password });
      login(data.token, { id: data.id, username: data.username }, data.settings);
      navigate('/');
    } catch (err) {
      setError(t('register.error'));
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-card rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-card-foreground">{t('register.title')}</h1>
        {error && <p className="text-center text-destructive">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-muted-foreground">{t('register.username')}</label>
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
            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">{t('register.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring"
              required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t('register.button')}
          </button>
        </form>
        <p className="text-sm text-center text-muted-foreground">
          {t('register.haveAccount')}{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            {t('register.login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
