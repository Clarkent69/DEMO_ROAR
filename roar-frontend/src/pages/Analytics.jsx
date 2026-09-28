import React, { useState } from 'react';
import { MOCK_RESEARCH } from '../config/mockData';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/roles';

const METRICS_ALL = [
  { icon: '📄', label: 'Total Research Submissions', value: '142', delta: '+12 this month' },
  { icon: '👁️', label: 'Total Document Views', value: '3,841', delta: '+284 this week' },
  { icon: '🏫', label: 'Departments Represented', value: '11', delta: 'Across SOCIT, SEAS, SBMA' },
  { icon: '📅', label: 'Submissions This Year', value: '38', delta: 'Since Jan 2026' },
];

const METRICS_FACULTY = [
  { icon: '📤', label: 'Your Submissions', value: '7', delta: '+2 pending review' },
  { icon: '✅', label: 'Approved & Published', value: '5', delta: 'This academic year' },
  { icon: '⏳', label: 'Awaiting Librarian Review', value: '2', delta: 'Submitted this month' },
  { icon: '🏆', label: 'Most Cited Work', value: 'Tidal Energy Systems in PH Waters', delta: '48 citations' },
];

const METRICS_LIBRARIAN = [
  { icon: '🗂️', label: 'Documents Archived This Month', value: '27', delta: '+5 vs last month' },
  { icon: '🔢', label: 'Call Numbers Assigned', value: '214', delta: 'Total in system' },
  { icon: '🔍', label: 'Pending Classification', value: '9', delta: 'In queue' },
  { icon: '📦', label: 'Archive Completion Rate', value: '94%', delta: '↑ 3% from last month' },
];

const METRICS_EXEC = [
  { icon: '👥', label: 'Active Faculty Representatives', value: '8', delta: 'Across 6 departments' },
  { icon: '📋', label: 'Departments with Coverage', value: '6 / 11', delta: '5 still need assignment' },
  { icon: '📈', label: 'Research Output Growth', value: '+23%', delta: 'Year-over-year' },
  { icon: '⚠️', label: 'Flagged Submissions', value: '3', delta: 'Requires governance review' },
];

function MetricCard({ icon, label, value, delta }) {
  return (
    <div className="metric-card">
      <span className="metric-icon">{icon}</span>
      <div className="metric-body">
        <p className="metric-label">{label}</p>
        <p className="metric-value">{value}</p>
        <p className="metric-delta">{delta}</p>
      </div>
    </div>
  );
}

export default function Analytics() {
  const { user } = useAuth();
  const role = user?.role;
  const [reportGenerated, setReportGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const primaryMetrics = (() => {
    if (role === ROLES.FACULTY_REP) return METRICS_FACULTY;
    if (role === ROLES.LIBRARIAN) return METRICS_LIBRARIAN;
    if (role === ROLES.EXECUTIVE_DIRECTOR) return METRICS_EXEC;
    return METRICS_ALL;
  })();

  const roleLabel = role === ROLES.FACULTY_REP ? 'Faculty Representative'
    : role === ROLES.LIBRARIAN ? 'Librarian'
    : role === ROLES.EXECUTIVE_DIRECTOR ? 'Executive Director'
    : 'Staff';

  const totalViews = MOCK_RESEARCH.reduce((s, r) => s + r.views, 0);
  const published = MOCK_RESEARCH.filter((r) => r.status === 'Published').length;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setReportGenerated(true); }, 1800);
  };

  // ── Gate screen ───────────────────────────────────────────
  if (!reportGenerated) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <div>
            <h2 className="analytics-title">📊 Analytics &amp; Reports</h2>
            <p className="analytics-sub">
              Generate a snapshot report for <strong>{roleLabel}</strong> role.
            </p>
          </div>
          <span className="analytics-mode-badge">Mock Data</span>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '56px 32px 48px', textAlign: 'center',
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 12, lineHeight: 1 }}>📈</div>
          <h3 style={{ color: 'var(--navy)', margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 800 }}>
            {roleLabel} Analytics Report
          </h3>
          <p style={{ color: 'var(--muted)', maxWidth: 420, margin: '0 auto 28px', fontSize: '0.88rem', lineHeight: 1.65 }}>
            Click <strong>Generate Report</strong> to compile your key metrics and the top-viewed
            research table into a formatted report view.
          </p>

          {/* Summary pills */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              { icon: '📄', label: `${MOCK_RESEARCH.length} Research Records` },
              { icon: '👁️', label: `${totalViews.toLocaleString()} Total Views` },
              { icon: '✅', label: `${published} Published` },
              { icon: '⏳', label: `${MOCK_RESEARCH.length - published} Under Review` },
            ].map((s) => (
              <div key={s.label} style={{
                background: 'var(--gold-light)', border: '1px solid #f0d98e',
                borderRadius: 10, padding: '9px 16px',
                fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)',
              }}>
                {s.icon} {s.label}
              </div>
            ))}
          </div>

          <button
            className="btn-gold"
            style={{ padding: '13px 42px', fontSize: '0.95rem', fontWeight: 800, borderRadius: 10 }}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '⏳ Generating report…' : '📊 Generate Report'}
          </button>
        </div>
      </div>
    );
  }

  // ── Full report view ──────────────────────────────────────
  return (
    <div className="analytics-container">

      {/* Header */}
      <div className="analytics-header">
        <div>
          <h2 className="analytics-title">📊 Analytics &amp; Reports</h2>
          <p className="analytics-sub">
            Showing <strong>{roleLabel}</strong> metrics — live data will replace these figures once Supabase is connected.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="analytics-mode-badge">Mock Data</span>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            onClick={() => setReportGenerated(false)}
          >
            ↺ New Report
          </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <section className="analytics-section">
        <h3 className="analytics-section-title">Key Metrics</h3>
        <div className="metrics-grid">
          {primaryMetrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </section>

      {/* Exec also sees system-wide */}
      {role === ROLES.EXECUTIVE_DIRECTOR && (
        <section className="analytics-section">
          <h3 className="analytics-section-title">System Overview</h3>
          <div className="metrics-grid">
            {METRICS_ALL.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>
        </section>
      )}

      {/* Top Viewed Research Table — sourced from MOCK_RESEARCH */}
      <section className="analytics-section">
        <h3 className="analytics-section-title">Top Viewed Research</h3>
        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Department</th>
                <th>Year</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {[...MOCK_RESEARCH].sort((a, b) => b.views - a.views).slice(0, 5).map((r, i) => (
                <tr key={r.id}>
                  <td className="table-rank">{i + 1}</td>
                  <td className="table-title">{r.title}</td>
                  <td><span className="table-dept">{r.department}</span></td>
                  <td>{r.year}</td>
                  <td className="table-views">{r.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
