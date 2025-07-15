
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { MonthlyViewPage } from './pages/MonthlyViewPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { GeneratedPdfsPage } from './pages/GeneratedPdfsPage';
import { AdminPage } from './pages/AdminPage';

import { AuthProvider, useAuth } from './context/AuthContext';
import { TaxDataProvider } from './context/TaxDataContext';
import { AppearanceProvider } from './context/AppearanceContext';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
      // You can add a loading spinner here
      return <div>Loading...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AppearanceProvider>
            <AuthProvider>
                <TaxDataProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            
                            <Route path="/" element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
                            <Route path="/month/:year/:month" element={<PrivateRoute><Layout><MonthlyViewPage /></Layout></PrivateRoute>} />
                            <Route path="/generated-pdfs" element={<PrivateRoute><Layout><GeneratedPdfsPage /></Layout></PrivateRoute>} />
                            <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
                            <Route path="/admin" element={<PrivateRoute><Layout><AdminPage /></Layout></PrivateRoute>} />
                            
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </BrowserRouter>
                </TaxDataProvider>
            </AuthProvider>
        </AppearanceProvider>
    );
}

export default App;
