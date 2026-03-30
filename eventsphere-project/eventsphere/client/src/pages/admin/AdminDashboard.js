import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { expoAPI, exhibitorAPI } from '../../utils/api';
import './Admin.css';

export default function AdminDashboard() {
  const [expos, setExpos] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      expoAPI.getAll(),
      exhibitorAPI.getAll({ status: 'pending' })
    ]).then(([e, ex]) => {
      setExpos(Array.isArray(e.data) ? e.data : []);
      setPending(Array.isArray(ex.data) ? ex.data : []);
    }).finally(() => setLoading(false));
      setPending(ex.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const upcoming = expos.filter(e => e.status === 'upcoming').length;
  const ongoing = expos.filter(e => e.status === 'ongoing').length;
  const totalAttendees = expos.reduce((sum, e) => sum + (e.registeredAttendees?.length || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">⚙️ Admin Dashboard</h1>
        <Link to="/admin/expos" className="btn btn-primary">+ Create Expo</Link>
      </div>

      <div className="admin-stats">
        {[
          { icon: '🎪', label: 'Total Expos', value: expos.length, color: '#6366f1' },
          { icon: '🔴', label: 'Ongoing', value: ongoing, color: '#10b981' },
          { icon: '⏳', label: 'Upcoming', value: upcoming, color: '#f59e0b' },
          { icon: '👥', label: 'Total Attendees', value: totalAttendees, color: '#ec4899' },
          { icon: '⏰', label: 'Pending Applications', value: pending.length, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className="admin-stat-card card">
            <div className="asc-icon" style={{ background: s.color + '15', color: s.color }}>{s.icon}</div>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-panels">
        <div className="card admin-panel">
          <div className="panel-header">
            <h3>Recent Expos</h3>
            <Link to="/admin/expos" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {expos.slice(0, 5).map(expo => (
            <div key={expo._id} className="panel-row">
              <span>🎪</span>
              <div>
                <strong>{expo.title}</strong>
                <small>{new Date(expo.date).toLocaleDateString()} · {expo.location}</small>
              </div>
              <span className={`badge badge-${expo.status === 'upcoming' ? 'info' : expo.status === 'ongoing' ? 'success' : 'gray'}`}>{expo.status}</span>
            </div>
          ))}
        </div>

        <div className="card admin-panel">
          <div className="panel-header">
            <h3>⏰ Pending Exhibitor Applications</h3>
            <Link to="/admin/exhibitors" className="btn btn-secondary btn-sm">Review All</Link>
          </div>
          {pending.length === 0 ? (
            <div className="empty-state" style={{ padding: 24 }}><p>No pending applications</p></div>
          ) : (
            pending.slice(0, 5).map(ex => (
              <div key={ex._id} className="panel-row">
                <div className="panel-avatar">{ex.companyName?.[0]}</div>
                <div>
                  <strong>{ex.companyName}</strong>
                  <small>{ex.user?.name} · {ex.category}</small>
                </div>
                <Link to="/admin/exhibitors" className="btn btn-primary btn-sm">Review</Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
