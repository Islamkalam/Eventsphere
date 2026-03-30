import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', company: user?.company || '', phone: user?.phone || '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile(form);
      setMsg('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify({ ...user, ...form }));
    } catch {
      setMsg('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header"><h1 className="page-title">👤 Profile</h1></div>
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{user?.name}</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>{user?.email}</p>
            <span className="badge badge-purple" style={{ marginTop: 4 }}>{user?.role}</span>
          </div>
        </div>
        {msg && <div className={`alert ${msg.includes('success') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email (read-only)</label>
            <input className="form-control" value={user?.email} disabled style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Company</label>
              <input className="form-control" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Your company" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 234 567 890" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}
