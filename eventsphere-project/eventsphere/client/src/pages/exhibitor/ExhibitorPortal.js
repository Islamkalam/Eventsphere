import React, { useState, useEffect } from 'react';
import { exhibitorAPI, expoAPI } from '../../utils/api';
import './ExhibitorPortal.css';

const emptyForm = { companyName: '', description: '', category: '', products: '', website: '', contactEmail: '', contactPhone: '', expo: '' };

export default function ExhibitorPortal() {
  const [applications, setApplications] = useState([]);
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    Promise.all([exhibitorAPI.getMy(), expoAPI.getAll({ status: 'upcoming' })])
      .then(([myRes, expoRes]) => { setApplications(myRes.data); setExpos(expoRes.data); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleApply = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const data = { ...form, products: form.products.split(',').map(p => p.trim()).filter(Boolean) };
      await exhibitorAPI.apply(data);
      setModal(false); setMsg('Application submitted!'); load();
    } catch (err) { setMsg(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger' };
  const statusIcons = { pending: '⏳', approved: '✅', rejected: '❌' };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🏪 Exhibitor Portal</h1>
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setModal(true); }}>+ Apply for Expo</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}

      {applications.length === 0 ? (
        <div className="empty-state card" style={{padding:60}}>
          <div style={{fontSize:48, marginBottom:12}}>🏪</div>
          <h3>No applications yet</h3>
          <p>Apply for an upcoming expo to showcase your products</p>
          <button className="btn btn-primary" style={{marginTop:16}} onClick={() => setModal(true)}>Apply Now</button>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map(app => (
            <div key={app._id} className="card application-card">
              <div className="app-header">
                <div className="app-logo">{app.companyName?.[0]}</div>
                <div>
                  <h3>{app.companyName}</h3>
                  <p>{app.expo?.title}</p>
                </div>
                <span className={`badge badge-${statusColors[app.status]}`}>{statusIcons[app.status]} {app.status}</span>
              </div>
              <div className="app-body">
                {app.category && <p>🏷️ <strong>Category:</strong> {app.category}</p>}
                {app.boothNumber && <p>🗺️ <strong>Booth:</strong> #{app.boothNumber}</p>}
                {app.expo?.date && <p>📅 <strong>Date:</strong> {new Date(app.expo.date).toLocaleDateString()}</p>}
                {app.expo?.location && <p>📍 <strong>Location:</strong> {app.expo.location}</p>}
              </div>
              {app.status === 'approved' && (
                <div className="app-approved">
                  <span>🎉 You're approved! Set up your booth at #{app.boothNumber || 'TBD'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Apply as Exhibitor</h3>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={handleApply}>
              <div className="form-group"><label>Select Expo *</label>
                <select className="form-control" value={form.expo} onChange={e => setForm({...form, expo: e.target.value})} required>
                  <option value="">Choose an expo...</option>
                  {expos.map(ex => <option key={ex._id} value={ex._id}>{ex.title} — {new Date(ex.date).toLocaleDateString()}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Company Name *</label><input className="form-control" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Category</label><input className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Technology" /></div>
                <div className="form-group"><label>Website</label><input className="form-control" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://..." /></div>
              </div>
              <div className="form-group"><label>Products / Services (comma separated)</label><input className="form-control" value={form.products} onChange={e => setForm({...form, products: e.target.value})} placeholder="Product A, Service B, ..." /></div>
              <div className="form-row">
                <div className="form-group"><label>Contact Email</label><input type="email" className="form-control" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} /></div>
                <div className="form-group"><label>Contact Phone</label><input className="form-control" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Submitting...' : 'Submit Application'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
