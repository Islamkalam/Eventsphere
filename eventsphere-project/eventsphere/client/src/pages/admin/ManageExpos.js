import React, { useState, useEffect } from 'react';
import { expoAPI } from '../../utils/api';
import './Admin.css';

const emptyForm = { title: '', description: '', date: '', endDate: '', location: '', theme: '', capacity: 500, boothCount: 50, status: 'upcoming' };

export default function ManageExpos() {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => expoAPI.getAll().then(r => setExpos(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditing(null); setModal(true); };
  const openEdit = (expo) => {
    setForm({ ...expo, date: expo.date?.split('T')[0], endDate: expo.endDate?.split('T')[0] });
    setEditing(expo._id); setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await expoAPI.update(editing, form);
      else await expoAPI.create(form);
      setModal(false); setMsg('Saved!'); load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expo?')) return;
    await expoAPI.delete(id);
    load();
  };

  const statusColors = { upcoming: 'info', ongoing: 'success', completed: 'gray', cancelled: 'danger' };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🗓️ Manage Expos</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Create Expo</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      {loading ? <div className="spinner" /> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th><th>Date</th><th>Location</th><th>Attendees</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expos.map(expo => (
              <tr key={expo._id}>
                <td><strong>{expo.title}</strong><br/><small style={{color:'var(--gray-500)'}}>{expo.theme}</small></td>
                <td>{new Date(expo.date).toLocaleDateString()}</td>
                <td>{expo.location}</td>
                <td>{expo.registeredAttendees?.length || 0} / {expo.capacity}</td>
                <td><span className={`badge badge-${statusColors[expo.status]}`}>{expo.status}</span></td>
                <td>
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(expo)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(expo._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Expo' : 'Create Expo'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Title *</label><input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div className="form-group"><label>Description *</label><textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Start Date *</label><input type="date" className="form-control" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
                <div className="form-group"><label>End Date *</label><input type="date" className="form-control" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required /></div>
              </div>
              <div className="form-group"><label>Location *</label><input className="form-control" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Theme</label><input className="form-control" value={form.theme} onChange={e => setForm({...form, theme: e.target.value})} /></div>
                <div className="form-group"><label>Status</label>
                  <select className="form-control" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Capacity</label><input type="number" className="form-control" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} /></div>
                <div className="form-group"><label>Booth Count</label><input type="number" className="form-control" value={form.boothCount} onChange={e => setForm({...form, boothCount: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Expo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
