import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expoAPI } from '../utils/api';
import './ExpoList.css';

export default function ExpoList() {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    expoAPI.getAll({ search, status })
      .then(res => setExpos(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, status]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🎪 Browse Expos</h1>
      </div>
      <div className="expo-filters card">
        <input className="form-control" placeholder="🔍 Search expos..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
        <select className="form-control" value={status} onChange={e => setStatus(e.target.value)} style={{ width: 160 }}>
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {loading ? <div className="spinner" /> : (
        expos.length === 0 ? (
          <div className="empty-state"><h3>No expos found</h3><p>Try adjusting your filters</p></div>
        ) : (
          <div className="expo-grid">
            {expos.map(expo => <ExpoCard key={expo._id} expo={expo} />)}
          </div>
        )
      )}
    </div>
  );
}

function ExpoCard({ expo }) {
  const colors = ['#6366f1,#8b5cf6', '#ec4899,#f43f5e', '#10b981,#06b6d4', '#f59e0b,#ef4444'];
  const gradient = colors[expo.title.charCodeAt(0) % colors.length];
  const statusMap = { upcoming: 'info', ongoing: 'success', completed: 'gray', cancelled: 'danger' };

  return (
    <Link to={`/expos/${expo._id}`} className="expo-card card">
      <div className="expo-card-banner" style={{ background: `linear-gradient(135deg, ${gradient})` }}>
        <span className="expo-card-icon">🎪</span>
        <span className={`badge badge-${statusMap[expo.status] || 'gray'}`}>{expo.status}</span>
      </div>
      <div className="expo-card-body">
        <h3>{expo.title}</h3>
        {expo.theme && <p className="expo-theme">🏷️ {expo.theme}</p>}
        <p className="expo-desc">{expo.description?.substring(0, 100)}...</p>
        <div className="expo-meta">
          <span>📅 {new Date(expo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span>📍 {expo.location}</span>
          <span>👥 {expo.registeredAttendees?.length || 0} / {expo.capacity}</span>
        </div>
        <div className="expo-card-footer">
          <span className="btn btn-primary btn-sm">View Details →</span>
        </div>
      </div>
    </Link>
  );
}
