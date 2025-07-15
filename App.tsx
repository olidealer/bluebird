import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { MonthlyViewPage } from './pages/MonthlyViewPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TaxDataProvider } from './hooks/useTaxData';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { GeneratedPdfsPage } from './pages/GeneratedPdfsPage';

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
            
            <Route 
                path="/" 
                element={isAuthenticated ? <Layout><DashboardPage /></Layout> : <Navigate to="/login" />} 
            />
            <Route 
                path="/month/:year/:month" 
                element={isAuthenticated ? <Layout><MonthlyViewPage /></Layout> : <Navigate to="/login" />} 
            />
             <Route 
                path="/generated-pdfs" 
                element={isAuthenticated ? <Layout><GeneratedPdfsPage /></Layout> : <Navigate to="/login" />} 
            />
            
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
    );
};


function App() {
    return (
        <HashRouter>
            <AuthProvider>
                <TaxDataProvider>
                    <AppRoutes />
                </TaxDataProvider>
            </AuthProvider>
        </HashRouter>
    );
}

export default App;