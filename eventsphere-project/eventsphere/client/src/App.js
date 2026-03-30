import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ExpoList from './pages/ExpoList';
import ExpoDetail from './pages/ExpoDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageExpos from './pages/admin/ManageExpos';
import ManageExhibitors from './pages/admin/ManageExhibitors';
import ManageSessions from './pages/admin/ManageSessions';
import ExhibitorPortal from './pages/exhibitor/ExhibitorPortal';
import MyBookings from './pages/attendee/MyBookings';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/expos" element={<ExpoList />} />
          <Route path="/expos/:id" element={<ExpoDetail />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/exhibitor-portal" element={<ProtectedRoute roles={['exhibitor', 'admin']}><ExhibitorPortal /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/expos" element={<ProtectedRoute roles={['admin']}><ManageExpos /></ProtectedRoute>} />
          <Route path="/admin/exhibitors" element={<ProtectedRoute roles={['admin']}><ManageExhibitors /></ProtectedRoute>} />
          <Route path="/admin/sessions" element={<ProtectedRoute roles={['admin']}><ManageSessions /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
