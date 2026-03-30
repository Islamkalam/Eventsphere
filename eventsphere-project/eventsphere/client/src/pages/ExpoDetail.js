import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expoAPI, sessionAPI, exhibitorAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './ExpoDetail.css';

export default function ExpoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expo, setExpo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [registering, setRegistering] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    Promise.all([
      expoAPI.getOne(id),
      sessionAPI.getForExpo(id),
      exhibitorAPI.getForExpo(id)
    ]).then(([expoRes, sessRes, exhRes]) => {
      setExpo(expoRes.data);
      setSessions(sessRes.data);
      setExhibitors(exhRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!user) return navigate('/login');
    setRegistering(true);
    try {
      await expoAPI.register(id);
      setMsg('Successfully registered for this expo!');
      const res = await expoAPI.getOne(id);
      setExpo(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const isRegistered = user && expo?.registeredAttendees?.some(a => a._id === user.id || a === user.id);

  if (loading) return <div className="spinner" />;
  if (!expo) return <div className="empty-state"><h3>Expo not found</h3></div>;

  const statusMap = { upcoming: 'info', ongoing: 'success', completed: 'gray', cancelled: 'danger' };

  return (
    <div className="expo-detail">
      <div className="expo-hero" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
        <div className="expo-hero-content">
          <span className={`badge badge-${statusMap[expo.status]}`}>{expo.status}</span>
          <h1>{expo.title}</h1>
          {expo.theme && <p className="expo-hero-theme">🏷️ {expo.theme}</p>}
          <div className="expo-hero-meta">
            <span>📅 {new Date(expo.date).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}</span>
            <span>📍 {expo.location}</span>
            <span>👥 {expo.registeredAttendees?.length || 0} / {expo.capacity} attendees</span>
          </div>
          {msg && <div className={`alert ${msg.includes('Success') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
          {expo.status !== 'completed' && expo.status !== 'cancelled' && (
            <button className="btn btn-primary btn-lg" onClick={handleRegister} disabled={registering || isRegistered}>
              {isRegistered ? '✓ Registered' : registering ? 'Registering...' : 'Register Now'}
            </button>
          )}
        </div>
      </div>

      <div className="expo-tabs">
        {['overview', 'sessions', 'exhibitors'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'overview' ? '📋' : t === 'sessions' ? '📅' : '🏪'} {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'sessions' && ` (${sessions.length})`}
            {t === 'exhibitors' && ` (${exhibitors.length})`}
          </button>
        ))}
      </div>

      <div className="expo-tab-content">
        {tab === 'overview' && (
          <div className="overview-grid">
            <div className="card overview-card">
              <h3>About this Expo</h3>
              <p>{expo.description}</p>
            </div>
            <div className="overview-stats">
              {[
                { label: 'Total Sessions', value: sessions.length, icon: '📅' },
                { label: 'Exhibitors', value: exhibitors.length, icon: '🏪' },
                { label: 'Attendees', value: expo.registeredAttendees?.length || 0, icon: '👥' },
                { label: 'Booth Spaces', value: expo.boothCount, icon: '🗺️' },
              ].map((s, i) => (
                <div key={i} className="card stat-card">
                  <span className="stat-icon">{s.icon}</span>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'sessions' && (
          sessions.length === 0 ? <div className="empty-state"><h3>No sessions yet</h3></div> : (
            <div className="sessions-list">
              {sessions.map(s => (
                <div key={s._id} className="card session-card">
                  <div className="session-type-badge">
                    <span className={`badge badge-purple`}>{s.type}</span>
                  </div>
                  <div className="session-info">
                    <h4>{s.title}</h4>
                    {s.speaker && <p>🎤 {s.speaker}</p>}
                    <p>🕐 {new Date(s.startTime).toLocaleString()} – {new Date(s.endTime).toLocaleTimeString()}</p>
                    {s.location && <p>📍 {s.location}</p>}
                    {s.description && <p className="session-desc">{s.description}</p>}
                  </div>
                  <div className="session-cap">
                    <strong>{s.registeredUsers?.length || 0}</strong>
                    <span>/ {s.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'exhibitors' && (
          exhibitors.length === 0 ? <div className="empty-state"><h3>No exhibitors yet</h3></div> : (
            <div className="grid-3">
              {exhibitors.map(ex => (
                <div key={ex._id} className="card exhibitor-card">
                  <div className="exhibitor-avatar">{ex.companyName?.[0]}</div>
                  <h4>{ex.companyName}</h4>
                  {ex.category && <span className="badge badge-purple">{ex.category}</span>}
                  <p>{ex.description?.substring(0, 100)}</p>
                  {ex.boothNumber && <p className="booth-num">🗺️ Booth #{ex.boothNumber}</p>}
                  {ex.website && <a href={ex.website} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">Visit Website</a>}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
