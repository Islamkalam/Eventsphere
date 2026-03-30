import React, { useState, useEffect } from 'react';
import { sessionAPI, expoAPI } from '../../utils/api';
import './Admin.css';

const emptyForm = { title: '', description: '', speaker: '', startTime: '', endTime: '', location: '', type: 'presentation', capacity: 100, expo: '' };

export default function ManageSessions() {
  const [sessions, setSessions] = useState([]);
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [selectedExpo, setSelectedExpo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    expoAPI.getAll().then(r => { setExpos(r.data); if (r.data[0]) setSelectedExpo(r.data[0]._id); });
  }, []);

  useEffect(() => {
    if (!selectedExpo) return setLoading(false);
    setLoading(true);
    sessionAPI.getForExpo(selectedExpo).then(r => setSessions(r.data)).finally(() => setLoading(false));
  }, [selectedExpo]);

  const openCreate = () => { setForm({...emptyForm, expo: selectedExpo}); setEditing(null); setModal(true); };
  const openEdit = (s) => {
    setForm({ ...s, expo: s.expo, startTime: s.startTime?.slice(0,16), endTime: s.endTime?.slice(0,16) });
    setEditing(s._id); setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await sessionAPI.update(editing, form);
      else await sessionAPI.create(form);
      setModal(false);
      sessionAPI.getForExpo(selectedExpo).then(r => setSessions(r.data));
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete session?')) return;
    await sessionAPI.delete(id);
    setSessions(sessions.filter(s => s._id !== id));
  };

  const typeColors = { keynote: 'danger', workshop: 'success', panel: 'warning', presentation: 'purple' };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📅 Manage Sessions</h1>
        <button className="btn btn-primary" onClick={openCreate} disabled={!selectedExpo}>+ Add Session</button>
      </div>
      <div className="manage-toolbar">
        <label style={{fontSize:13, fontWeight:500}}>Select Expo:</label>
        <select className="form-control" style={{width:260}} value={selectedExpo} onChange={e => setSelectedExpo(e.target.value)}>
          {expos.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
        </select>
      </div>
      {loading ? <div className="spinner" /> : sessions.length === 0 ? (
        <div className="empty-state"><h3>No sessions yet</h3><p>Add sessions for this expo</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>Title</th><th>Type</th><th>Speaker</th><th>Start</th><th>Location</th><th>Registered</th><th>Actions</th></tr></thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s._id}>
                <td><strong>{s.title}</strong></td>
                <td><span className={`badge badge-${typeColors[s.type]}`}>{s.type}</span></td>
                <td>{s.speaker || '—'}</td>
                <td>{new Date(s.startTime).toLocaleString()}</td>
                <td>{s.location || '—'}</td>
                <td>{s.registeredUsers?.length || 0} / {s.capacity}</td>
                <td>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
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
              <h3>{editing ? 'Edit Session' : 'Add Session'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Expo</label>
                <select className="form-control" value={form.expo} onChange={e => setForm({...form, expo: e.target.value})}>
                  {expos.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Session Title *</label><input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Speaker</label><input className="form-control" value={form.speaker} onChange={e => setForm({...form, speaker: e.target.value})} /></div>
                <div className="form-group"><label>Type</label>
                  <select className="form-control" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="keynote">Keynote</option><option value="workshop">Workshop</option>
                    <option value="panel">Panel</option><option value="presentation">Presentation</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Start Time *</label><input type="datetime-local" className="form-control" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} required /></div>
                <div className="form-group"><label>End Time *</label><input type="datetime-local" className="form-control" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Location</label><input className="form-control" value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
                <div className="form-group"><label>Capacity</label><input type="number" className="form-control" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Session'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
