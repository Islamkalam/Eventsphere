import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo">🌐</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your EventSphere account</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-demo">
          <p>Demo accounts:</p>
          <div className="demo-accounts">
            <button onClick={() => setForm({email:'admin@demo.com', password:'admin123'})}>Admin</button>
            <button onClick={() => setForm({email:'exhibitor@demo.com', password:'exhibit123'})}>Exhibitor</button>
            <button onClick={() => setForm({email:'attendee@demo.com', password:'attend123'})}>Attendee</button>
          </div>
        </div>
        <p className="auth-footer">Don't have an account? <Link to="/register">Sign up free</Link></p>
      </div>
    </div>
  );
}
