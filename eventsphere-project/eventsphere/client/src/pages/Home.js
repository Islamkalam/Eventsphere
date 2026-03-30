import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { expoAPI } from '../utils/api';
import './Home.css';

export default function Home() {
  const [expos, setExpos] = useState([]);

  useEffect(() => {
    expoAPI.getAll({ status: 'upcoming' }).then(res => setExpos(res.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Next-Gen Event Management</div>
          <h1 className="hero-title">
            Manage Events<br />
            <span className="gradient-text">Like Never Before</span>
          </h1>
          <p className="hero-desc">
            EventSphere connects organizers, exhibitors, and attendees in one seamless platform.
            Create, manage, and experience world-class expos and trade shows.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/expos" className="btn btn-secondary btn-lg">Browse Events</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>500+</strong><span>Events Hosted</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>10K+</strong><span>Attendees</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>2K+</strong><span>Exhibitors</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hc-header">
              <div className="hc-dot red" /><div className="hc-dot yellow" /><div className="hc-dot green" />
            </div>
            <div className="hc-body">
              <div className="hc-item"><span>🎪</span><div><strong>Tech Expo 2025</strong><small>Mar 15 · San Francisco</small></div><span className="badge badge-success">Live</span></div>
              <div className="hc-item"><span>🏭</span><div><strong>Industry Summit</strong><small>Apr 02 · New York</small></div><span className="badge badge-info">Soon</span></div>
              <div className="hc-item"><span>🔬</span><div><strong>Science Fair</strong><small>May 10 · Chicago</small></div><span className="badge badge-purple">Upcoming</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Everything you need to run successful events</h2>
        <div className="features-grid">
          {[
            { icon: '🎯', title: 'Smart Registration', desc: 'Streamlined registration for attendees, exhibitors, and organizers with role-based access.' },
            { icon: '🗺️', title: 'Floor Plan Management', desc: 'Manage booth allocations and floor plans visually with real-time availability.' },
            { icon: '📅', title: 'Session Scheduling', desc: 'Create and manage event sessions, workshops, and keynotes with speaker assignments.' },
            { icon: '📊', title: 'Real-time Analytics', desc: 'Track attendance, booth traffic, and session popularity with live dashboards.' },
            { icon: '💬', title: 'Communication Hub', desc: 'Built-in messaging between organizers, exhibitors, and attendees.' },
            { icon: '🔒', title: 'Secure & Reliable', desc: 'Enterprise-grade security with JWT auth, encrypted data, and 99% uptime guarantee.' },
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {expos.length > 0 && (
        <section className="upcoming-section">
          <div className="section-header">
            <h2 className="section-title">Upcoming Expos</h2>
            <Link to="/expos" className="btn btn-secondary">View All →</Link>
          </div>
          <div className="grid-3">
            {expos.map(expo => <ExpoCard key={expo._id} expo={expo} />)}
          </div>
        </section>
      )}

      <section className="roles-section">
        <h2 className="section-title">Built for Every Role</h2>
        <div className="roles-grid">
          {[
            { icon: '⚙️', role: 'Organizer / Admin', color: '#6366f1', items: ['Create & manage expos', 'Approve exhibitors', 'Manage sessions & speakers', 'View analytics & reports'] },
            { icon: '🏪', role: 'Exhibitor', color: '#ec4899', items: ['Apply for booth spaces', 'Manage company profile', 'Interact with attendees', 'Track booth performance'] },
            { icon: '🎟️', role: 'Attendee', color: '#10b981', items: ['Browse & register for expos', 'Bookmark sessions', 'Find exhibitors', 'Receive reminders'] },
          ].map((r, i) => (
            <div className="role-card" key={i} style={{ borderTopColor: r.color }}>
              <div className="role-icon" style={{ background: r.color + '15', color: r.color }}>{r.icon}</div>
              <h3>{r.role}</h3>
              <ul>{r.items.map((item, j) => <li key={j}>✓ {item}</li>)}</ul>
              <Link to="/register" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Join as {r.role.split(' ')[0]}</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 EventSphere Management · Built with MERN Stack</p>
      </footer>
    </div>
  );
}

function ExpoCard({ expo }) {
  return (
    <Link to={`/expos/${expo._id}`} className="expo-preview-card card">
      <div className="epc-image" style={{ background: `linear-gradient(135deg, #6366f1, #ec4899)` }}>
        <span>🎪</span>
      </div>
      <div className="epc-body">
        <span className={`badge badge-${expo.status === 'upcoming' ? 'info' : 'success'}`}>{expo.status}</span>
        <h3>{expo.title}</h3>
        <p>📅 {new Date(expo.date).toLocaleDateString()}</p>
        <p>📍 {expo.location}</p>
      </div>
    </Link>
  );
}
