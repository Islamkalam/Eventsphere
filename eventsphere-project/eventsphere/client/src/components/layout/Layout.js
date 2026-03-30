import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const NavLink = ({ to, children, icon }) => {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(to + '/');
  return (
    <Link to={to} className={`nav-link ${active ? 'active' : ''}`}>
      <span className="nav-icon">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="app-layout">
      <header className="topbar">
        <div className="topbar-left">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          <Link to="/" className="logo">
            <span className="logo-icon">🌐</span>
            <span className="logo-text">EventSphere</span>
          </Link>
        </div>
        <nav className="topbar-nav">
          <Link to="/expos" className="topbar-link">Expos</Link>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu">
              <button className="user-avatar-btn">
                <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                <span className="user-name">{user.name}</span>
                <span className="role-badge">{user.role}</span>
              </button>
              <div className="user-dropdown">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/profile">Profile</Link>
                {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </nav>
      </header>

      <div className="app-body">
        {user && (
          <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
            <div className="sidebar-section">
              <p className="sidebar-label">Menu</p>
              <NavLink to="/dashboard" icon="📊">Dashboard</NavLink>
              <NavLink to="/expos" icon="🎪">Browse Expos</NavLink>
              <NavLink to="/my-bookings" icon="🎫">My Bookings</NavLink>
            </div>
            {(user.role === 'exhibitor' || user.role === 'admin') && (
              <div className="sidebar-section">
                <p className="sidebar-label">Exhibitor</p>
                <NavLink to="/exhibitor-portal" icon="🏪">Exhibitor Portal</NavLink>
              </div>
            )}
            {user.role === 'admin' && (
              <div className="sidebar-section">
                <p className="sidebar-label">Admin</p>
                <NavLink to="/admin" icon="⚙️">Overview</NavLink>
                <NavLink to="/admin/expos" icon="🗓️">Manage Expos</NavLink>
                <NavLink to="/admin/exhibitors" icon="👥">Exhibitors</NavLink>
                <NavLink to="/admin/sessions" icon="📅">Sessions</NavLink>
              </div>
            )}
            <div className="sidebar-section">
              <NavLink to="/profile" icon="👤">Profile</NavLink>
            </div>
          </aside>
        )}
        <main className={`main-content ${user ? 'with-sidebar' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
