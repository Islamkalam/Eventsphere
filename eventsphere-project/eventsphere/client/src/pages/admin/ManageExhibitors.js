import React, { useState, useEffect } from 'react';
import { exhibitorAPI } from '../../utils/api';
import './Admin.css';

export default function ManageExhibitors() {
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processing, setProcessing] = useState({});
  const [boothInputs, setBoothInputs] = useState({});

  const load = () => {
    setLoading(true);
    exhibitorAPI.getAll({ status: filter || undefined })
      .then(r => setExhibitors(r.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filter]);

  const handleStatus = async (id, status) => {
    setProcessing(p => ({...p, [id]: true}));
    try {
      await exhibitorAPI.updateStatus(id, { status, boothNumber: boothInputs[id] || '' });
      load();
    } finally {
      setProcessing(p => ({...p, [id]: false}));
    }
  };

  const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger' };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">👥 Manage Exhibitors</h1></div>
      <div className="manage-toolbar">
        {['', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setFilter(s)}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      {loading ? <div className="spinner" /> : (
        <table className="data-table">
          <thead>
            <tr><th>Company</th><th>Expo</th><th>Contact</th><th>Category</th><th>Status</th><th>Booth</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {exhibitors.map(ex => (
              <tr key={ex._id}>
                <td><strong>{ex.companyName}</strong><br/><small style={{color:'var(--gray-500)'}}>{ex.user?.name}</small></td>
                <td>{ex.expo?.title || '—'}</td>
                <td>{ex.user?.email}</td>
                <td>{ex.category || '—'}</td>
                <td><span className={`badge badge-${statusColors[ex.status]}`}>{ex.status}</span></td>
                <td>
                  {ex.status === 'pending' ? (
                    <input className="form-control" style={{width:80, padding:'4px 8px'}} placeholder="Booth #"
                      value={boothInputs[ex._id] || ''} onChange={e => setBoothInputs(b => ({...b, [ex._id]: e.target.value}))} />
                  ) : ex.boothNumber || '—'}
                </td>
                <td>
                  {ex.status === 'pending' && (
                    <div style={{display:'flex', gap:6}}>
                      <button className="btn btn-success btn-sm" disabled={processing[ex._id]} onClick={() => handleStatus(ex._id, 'approved')}>✓ Approve</button>
                      <button className="btn btn-danger btn-sm" disabled={processing[ex._id]} onClick={() => handleStatus(ex._id, 'rejected')}>✗ Reject</button>
                    </div>
                  )}
                  {ex.status !== 'pending' && <span style={{color:'var(--gray-400)', fontSize:12}}>Reviewed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && exhibitors.length === 0 && <div className="empty-state"><h3>No exhibitors found</h3></div>}
    </div>
  );
}
