import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'attendee', company: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide card">
        <div className="auth-header">
          <div className="auth-logo">🌐</div>
          <h2>Create Account</h2>
          <p>Join EventSphere today</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input className="form-control" placeholder="John Doe"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input className="form-control" type="email" placeholder="john@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input className="form-control" type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
            </div>
            <div className="form-group">
              <label>I am a...</label>
              <select className="form-control" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="attendee">Attendee</option>
                <option value="exhibitor">Exhibitor</option>
                <option value="admin">Organizer / Admin</option>
              </select>
            </div>
          </div>
          {(form.role === 'exhibitor' || form.role === 'admin') && (
            <div className="form-row">
              <div className="form-group">
                <label>Company</label>
                <input className="form-control" placeholder="Your company"
                  value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input className="form-control" placeholder="+1 234 567 8900"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
