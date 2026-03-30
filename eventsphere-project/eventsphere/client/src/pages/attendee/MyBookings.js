import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../utils/api';

export default function MyBookings() {
  const [data, setData] = useState({ expos: [], sessions: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('expos');

  bookingAPI.getMy().then(r => setData({
      expos: Array.isArray(r.data?.expos) ? r.data.expos : [],
      sessions: Array.isArray(r.data?.sessions) ? r.data.sessions : []
    })).finally(() => setLoading(false));

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">🎫 My Bookings</h1></div>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--gray-200)', marginBottom: 24 }}>
        {['expos', 'sessions'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '12px 20px', fontSize: 14, fontWeight: 500, background: 'none', border: 'none',
              borderBottom: `2px solid ${tab === t ? 'var(--primary)' : 'transparent'}`,
              color: tab === t ? 'var(--primary)' : 'var(--gray-500)', cursor: 'pointer' }}>
            {t === 'expos' ? '🎪' : '📅'} {t.charAt(0).toUpperCase() + t.slice(1)} ({data[t]?.length || 0})
          </button>
        ))}
      </div>

      {tab === 'expos' && (
        data.expos.length === 0 ? (
          <div className="empty-state card" style={{padding:60}}>
            <div style={{fontSize:48}}>🎪</div>
            <h3>No registered expos</h3>
            <p>Browse and register for expos to see them here</p>
          </div>
        ) : (
          <div className="grid-3">
            {data.expos.map(expo => (
              <div key={expo._id} className="card" style={{padding:20}}>
                <div style={{fontSize:32, marginBottom:12}}>🎪</div>
                <h3 style={{fontSize:16, fontWeight:600, marginBottom:8}}>{expo.title}</h3>
                <p style={{fontSize:13, color:'var(--gray-500)'}}>📅 {new Date(expo.date).toLocaleDateString()}</p>
                <p style={{fontSize:13, color:'var(--gray-500)'}}>📍 {expo.location}</p>
                <span className={`badge badge-${expo.status === 'upcoming' ? 'info' : 'success'}`} style={{marginTop:8}}>{expo.status}</span>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'sessions' && (
        data.sessions.length === 0 ? (
          <div className="empty-state card" style={{padding:60}}>
            <div style={{fontSize:48}}>📅</div>
            <h3>No bookmarked sessions</h3>
            <p>Bookmark sessions from expo pages to see them here</p>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            {data.sessions.map(session => (
              <div key={session._id} className="card" style={{padding:20, display:'flex', gap:16, alignItems:'flex-start'}}>
                <div style={{fontSize:32}}>📅</div>
                <div style={{flex:1}}>
                  <h3 style={{fontSize:15, fontWeight:600, marginBottom:4}}>{session.title}</h3>
                  <p style={{fontSize:13, color:'var(--gray-500)'}}>🎪 {session.expo?.title}</p>
                  {session.speaker && <p style={{fontSize:13, color:'var(--gray-500)'}}>🎤 {session.speaker}</p>}
                  <p style={{fontSize:13, color:'var(--gray-500)'}}>🕐 {new Date(session.startTime).toLocaleString()}</p>
                  {session.location && <p style={{fontSize:13, color:'var(--gray-500)'}}>📍 {session.location}</p>}
                </div>
                <span className="badge badge-purple">{session.type}</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
