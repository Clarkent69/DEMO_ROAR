import React, { useState } from 'react';
import { MOCK_MATERIALS } from '../config/mockData';

export default function ManageMaterials() {
  const [materials, setMaterials] = useState(() =>
    MOCK_MATERIALS.map((m) => ({ ...m }))
  );
  const [activeTab, setActiveTab] = useState('pending');
  const [callInputs, setCallInputs] = useState({}); // id → string

  const pending = materials.filter((m) => m.status === 'Pending');
  const archived = materials.filter((m) => m.status === 'Archived');
  const restored = materials.filter((m) => m.status === 'Restored');

  const assignCallNumber = (id) => {
    const cn = callInputs[id]?.trim();
    if (!cn) return;
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, callNumber: cn, status: 'Archived', archivedDate: new Date().toISOString().slice(0, 10) }
          : m
      )
    );
    setCallInputs((prev) => ({ ...prev, [id]: '' }));
  };

  const restoreRecord = (id) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: 'Restored', restoredDate: new Date().toISOString().slice(0, 10) }
          : m
      )
    );
  };

  const reArchive = (id) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: 'Archived', restoredDate: null }
          : m
      )
    );
  };

  const TABS = [
    { key: 'pending', label: `Pending Review (${pending.length})` },
    { key: 'archived', label: `Archived (${archived.length})` },
    { key: 'restored', label: `Restored (${restored.length})` },
  ];

  const renderPending = () => (
    pending.length === 0 ? (
      <div className="empty-state">No manuscripts pending review. All submissions have been cataloged.</div>
    ) : (
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Dept</th>
              <th>Submitted</th>
              <th>Assign Call Number</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((m) => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600, maxWidth: 260 }}>{m.title}</td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{m.authors.join(', ')}</td>
                <td><span className="research-dept-badge">{m.department}</span></td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{m.submittedDate}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input
                      className="call-number-input"
                      type="text"
                      placeholder="e.g. APC-2026-SOCIT-003"
                      value={callInputs[m.id] || ''}
                      onChange={(e) => setCallInputs((prev) => ({ ...prev, [m.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') assignCallNumber(m.id); }}
                    />
                    <button className="btn-sm-gold" onClick={() => assignCallNumber(m.id)}>
                      Assign
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );

  const renderArchived = () => (
    archived.length === 0 ? (
      <div className="empty-state">No archived materials yet.</div>
    ) : (
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Call Number</th>
              <th>Title</th>
              <th>Authors</th>
              <th>Dept</th>
              <th>Archived</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {archived.map((m) => (
              <tr key={m.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--navy)', fontWeight: 700 }}>
                  {m.callNumber}
                </td>
                <td style={{ fontWeight: 600, maxWidth: 240 }}>{m.title}</td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{m.authors.join(', ')}</td>
                <td><span className="research-dept-badge">{m.department}</span></td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{m.archivedDate}</td>
                <td>
                  <button className="btn-sm-restore" onClick={() => restoreRecord(m.id)}>
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );

  const renderRestored = () => (
    restored.length === 0 ? (
      <div className="empty-state">No restored records. Restored items appear here after you restore them from the Archived tab.</div>
    ) : (
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Call Number</th>
              <th>Title</th>
              <th>Dept</th>
              <th>Restored On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {restored.map((m) => (
              <tr key={m.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--navy)', fontWeight: 700 }}>
                  {m.callNumber}
                </td>
                <td style={{ fontWeight: 600, maxWidth: 280 }}>{m.title}</td>
                <td><span className="research-dept-badge">{m.department}</span></td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{m.restoredDate}</td>
                <td>
                  <button className="btn-sm-archive" onClick={() => reArchive(m.id)}>
                    Re-archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );

  return (
    <div className="materials-container">

      <h2 className="section-heading">Catalog &amp; Archive Documents</h2>

      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '20px' }}>
        Assign call numbers to submitted manuscripts, manage the archive, and restore records as needed.
      </p>

      {/* Tab bar */}
      <div className="materials-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`materials-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'pending' && renderPending()}
      {activeTab === 'archived' && renderArchived()}
      {activeTab === 'restored' && renderRestored()}

    </div>
  );
}
