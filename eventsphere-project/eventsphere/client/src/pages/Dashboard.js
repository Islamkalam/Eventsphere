import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  const cards = user?.role === 'admin' ? [
    { icon: '⚙️', title: 'Manage Expos', desc: 'Create and manage expo events', link: '/admin/expos', color: '#6366f1' },
    { icon: '👥', title: 'Exhibitors', desc: 'Review and approve exhibitor applications', link: '/admin/exhibitors', color: '#ec4899' },
    { icon: '📅', title: 'Sessions', desc: 'Manage event sessions and schedules', link: '/admin/sessions', color: '#10b981' },
    { icon: '📊', title: 'Analytics', desc: 'View reports and performance data', link: '/admin', color: '#f59e0b' },
  ] : user?.role === 'exhibitor' ? [
    { icon: '🏪', title: 'Exhibitor Portal', desc: 'Manage your booth applications', link: '/exhibitor-portal', color: '#6366f1' },
    { icon: '🎪', title: 'Browse Expos', desc: 'Find and apply for upcoming expos', link: '/expos', color: '#ec4899' },
    { icon: '🎫', title: 'My Bookings', desc: 'View your registrations', link: '/my-bookings', color: '#10b981' },
    { icon: '👤', title: 'Profile', desc: 'Update your profile information', link: '/profile', color: '#f59e0b' },
  ] : [
    { icon: '🎪', title: 'Browse Expos', desc: 'Discover upcoming events and expos', link: '/expos', color: '#6366f1' },
    { icon: '🎫', title: 'My Bookings', desc: 'View your registered expos and sessions', link: '/my-bookings', color: '#ec4899' },
    { icon: '👤', title: 'Profile', desc: 'Update your account information', link: '/profile', color: '#10b981' },
  ];

  return (
    <div>
      <div className="dashboard-welcome">
        <div className="welcome-avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>You're logged in as <strong>{user?.role}</strong> · {user?.email}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((card, i) => (
          <Link to={card.link} key={i} className="dashboard-card card">
            <div className="dc-icon" style={{ background: card.color + '15', color: card.color }}>{card.icon}</div>
            <div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
            <span className="dc-arrow" style={{ color: card.color }}>→</span>
          </Link>
        ))}
      </div>

      {user?.role === 'admin' && (
        <div className="quick-actions card">
          <h3>⚡ Quick Actions</h3>
          <div className="qa-buttons">
            <Link to="/admin/expos" className="btn btn-primary">+ Create Expo</Link>
            <Link to="/admin/sessions" className="btn btn-secondary">+ Add Session</Link>
            <Link to="/admin/exhibitors" className="btn btn-secondary">Review Applications</Link>
          </div>
        </div>
      )}
    </div>
  );
}
