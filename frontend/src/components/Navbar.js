import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Ink<span>well</span>
        </Link>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/" className="btn btn-ghost">Home</Link>
              <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
              <Link to="/create" className="btn btn-accent">+ Write</Link>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
