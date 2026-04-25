import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import ViewPost from './pages/ViewPost';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<ViewPost />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
