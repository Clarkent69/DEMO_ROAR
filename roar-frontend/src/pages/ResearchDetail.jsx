import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_RESEARCH } from '../config/mockData';

export default function ResearchDetail() {
  const { id } = useParams();
  const paper = MOCK_RESEARCH.find((r) => r.id === id);

  if (!paper) {
    return (
      <div className="detail-container">
        <div className="detail-breadcrumb">
          <Link to="/">← Back to Browse</Link>
        </div>
        <div className="empty-state">Research record not found.</div>
      </div>
    );
  }

  return (
    <div className="detail-container">

      <div className="detail-breadcrumb">
        <Link to="/">← Back to Browse</Link>
      </div>

      <div className="detail-card">

        <div className="detail-dept-row">
          <span className="research-dept-badge">{paper.department}</span>
          <span className={`research-status-badge ${paper.status === 'Published' ? 'published' : 'review'}`}>
            {paper.status}
          </span>
          {paper.callNumber && (
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 'auto' }}>
              📁 {paper.callNumber}
            </span>
          )}
        </div>

        <h1 className="detail-title">{paper.title}</h1>

        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <label>Author(s)</label>
            <span>{paper.authors.join(', ')}</span>
          </div>
          <div className="detail-meta-item">
            <label>Program</label>
            <span>{paper.program}</span>
          </div>
          <div className="detail-meta-item">
            <label>Department</label>
            <span>{paper.department}</span>
          </div>
          <div className="detail-meta-item">
            <label>Year Published</label>
            <span>{paper.year}</span>
          </div>
          <div className="detail-meta-item">
            <label>Views</label>
            <span>{paper.views}</span>
          </div>
          <div className="detail-meta-item">
            <label>Date Submitted</label>
            <span>{paper.submittedDate}</span>
          </div>
          {paper.callNumber && (
            <div className="detail-meta-item">
              <label>Call Number</label>
              <span>{paper.callNumber}</span>
            </div>
          )}
          {paper.archivedDate && (
            <div className="detail-meta-item">
              <label>Date Archived</label>
              <span>{paper.archivedDate}</span>
            </div>
          )}
        </div>

        <p className="detail-abstract-label">Abstract</p>
        <p className="detail-abstract">{paper.abstract}</p>

        <div className="detail-keywords">
          {paper.keywords.map((k) => (
            <span key={k} className="detail-keyword">{k}</span>
          ))}
        </div>

      </div>
    </div>
  );
}
