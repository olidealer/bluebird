import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('demo');
    const [password, setPassword] = useState('demo');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            // Navigation is handled by the auth hook
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-primary to-teal-600">
            <Card className="w-full max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-brand-dark">Rental Property Tax</h1>
                    <p className="mt-2 text-gray-600">Inicia sesión para gestionar tus impuestos</p>
                    <p className="mt-4 text-sm bg-yellow-100 text-yellow-800 p-2 rounded-md">
                        Puedes usar <strong>demo</strong> / <strong>demo</strong> para ingresar.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <Input id="email" label="Usuario" type="text" placeholder="demo" required value={email} onChange={e => setEmail(e.target.value)} />
                    <Input id="password" label="Contraseña" type="password" placeholder="demo" required value={password} onChange={e => setPassword(e.target.value)} />
                    
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Recuérdame</label>
                        </div>
                    </div>
                    <div>
                        <Button type="submit" className="w-full flex justify-center">
                            Iniciar Sesión
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};