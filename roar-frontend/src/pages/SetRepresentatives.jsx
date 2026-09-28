import React, { useState } from 'react';
import { MOCK_REPRESENTATIVES } from '../config/mockData';

const DEPARTMENTS = ['SOCIT', 'SEAS', 'SBMA'];

let nextId = 100;

export default function SetRepresentatives() {
  const [reps, setReps] = useState(MOCK_REPRESENTATIVES);
  const [showModal, setShowModal] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null); // rep id to remove
  const [form, setForm] = useState({ name: '', department: 'SOCIT', program: '', email: '' });
  const [formError, setFormError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.program) {
      setFormError('All fields are required.');
      return;
    }
    const newRep = {
      id: `rep-${++nextId}`,
      name: form.name,
      department: form.department,
      program: form.program,
      email: form.email,
      status: 'Active',
      since: new Date().toISOString().slice(0, 10),
    };
    setReps((prev) => [newRep, ...prev]);
    setShowModal(false);
    setForm({ name: '', department: 'SOCIT', program: '', email: '' });
    setFormError('');
  };

  const handleRemove = (id) => {
    setReps((prev) => prev.filter((r) => r.id !== id));
    setConfirmRemove(null);
  };

  return (
    <div className="reps-container">

      <div className="reps-toolbar">
        <h2 className="section-heading" style={{ margin: 0 }}>Faculty Representatives</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          ＋ Add Representative
        </button>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '20px' }}>
        {reps.filter((r) => r.status === 'Active').length} active representatives across {DEPARTMENTS.length} departments.
      </p>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Program</th>
              <th>Email</th>
              <th>Since</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reps.map((rep) => (
              <tr key={rep.id}>
                <td style={{ fontWeight: 600 }}>{rep.name}</td>
                <td>
                  <span className="research-dept-badge">{rep.department}</span>
                </td>
                <td style={{ fontSize: '0.82rem' }}>{rep.program}</td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{rep.email}</td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{rep.since}</td>
                <td>
                  <span className={`status-pill ${rep.status.toLowerCase()}`}>{rep.status}</span>
                </td>
                <td>
                  {confirmRemove === rep.id ? (
                    <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>Confirm?</span>
                      <button className="btn-danger" onClick={() => handleRemove(rep.id)}>Yes</button>
                      <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setConfirmRemove(null)}>No</button>
                    </span>
                  ) : (
                    <button className="btn-danger" onClick={() => setConfirmRemove(rep.id)}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Representative Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add Faculty Representative</h3>
            {formError && (
              <p style={{ fontSize: '0.82rem', color: '#b91c1c', marginBottom: '12px' }}>⚠️ {formError}</p>
            )}
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Juan dela Cruz"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Program</label>
                <input
                  type="text"
                  placeholder="e.g. BS Computer Science"
                  value={form.program}
                  onChange={(e) => setForm((f) => ({ ...f, program: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Institutional Email</label>
                <input
                  type="email"
                  placeholder="name@apc.edu.ph"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); setFormError(''); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold">Add Representative</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
