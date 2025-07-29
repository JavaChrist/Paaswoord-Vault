import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}