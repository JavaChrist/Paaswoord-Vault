import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un temps de chargement initial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 secondes

    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <LoadingScreen isVisible={isLoading} />
        {!isLoading && (
          <Router>
            <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Route protégée - Password Vault Dashboard */}
            <Route path="/vault" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Redirections */}
            <Route path="/" element={<Navigate to="/vault" />} />
            <Route path="/dashboard" element={<Navigate to="/vault" />} />
            <Route path="*" element={<Navigate to="/vault" />} />
            </Routes>
          </Router>
        )}
      </AuthProvider>
    </ToastProvider>
  );
}