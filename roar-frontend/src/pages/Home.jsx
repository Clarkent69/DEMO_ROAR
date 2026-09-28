import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_RESEARCH } from '../config/mockData';

const DEPARTMENTS = ['All', 'SOE', 'SOM', 'SOCIT'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('All');
  const navigate = useNavigate();

  const filtered = MOCK_RESEARCH.filter((r) => {
    const matchesDept = dept === 'All' || r.department === dept;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.authors.some((a) => a.toLowerCase().includes(q)) ||
      r.keywords.some((k) => k.toLowerCase().includes(q));
    return matchesDept && matchesQuery;
  });

  return (
    <div className="browse-container">

      <h2 className="section-heading">Browse &amp; View Research</h2>

      {/* Search bar */}
      <div className="browse-search-bar">
        <input
          className="browse-search-input"
          type="text"
          placeholder="Search by title, author, or keyword…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search research"
        />
      </div>

      {/* Department filters */}
      <div className="browse-filters">
        {DEPARTMENTS.map((d) => (
          <button
            key={d}
            className={`filter-chip ${dept === d ? 'active' : ''}`}
            onClick={() => setDept(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '16px' }}>
        Showing <strong>{filtered.length}</strong> of {MOCK_RESEARCH.length} research outputs
      </p>

      {/* Research card grid */}
      <div className="browse-grid">
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            No results found for "{query}". Try a different keyword or filter.
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="research-card"
              onClick={() => navigate(`/research/${r.id}`)}
            >
              <div className="research-card-dept">
                <span className="research-dept-badge">{r.department}</span>
                <span className={`research-status-badge ${r.status === 'Published' ? 'published' : 'review'}`}>
                  {r.status}
                </span>
              </div>
              <h3 className="research-card-title">{r.title}</h3>
              <p className="research-card-authors">
                {r.authors.join(', ')} · {r.program}
              </p>
              <div className="research-card-meta">
                <span>📅 {r.year} &nbsp;·&nbsp; 👁️ {r.views} views</span>
                <span className="research-view-link">View details →</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
