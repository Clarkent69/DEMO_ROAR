import React, { useState, useRef } from 'react';
import { MOCK_RESEARCH } from '../config/mockData';

// Simulate AI extraction using a randomly picked mock paper's metadata
function fakeExtract(filename) {
  const sample = MOCK_RESEARCH[Math.floor(Math.random() * MOCK_RESEARCH.length)];
  return {
    title: sample.title,
    authors: sample.authors.join(', '),
    department: sample.department,
    program: sample.program,
    year: sample.year,
    keywords: sample.keywords.join(', '),
    abstract: sample.abstract,
  };
}

const DOC_TYPES = [
  { value: '', label: 'Select document type…' },
  { value: 'thesis', label: 'Undergraduate Thesis / Feasibility Study' },
  { value: 'dissertation', label: 'Graduate Dissertation' },
  { value: 'journal', label: 'Journal Article / Conference Paper' },
  { value: 'capstone', label: 'Capstone Project' },
  { value: 'technical', label: 'Technical Report' },
];

export default function SubmitResearch() {
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const [formData, setFormData] = useState({
    title: '', authors: '', department: '', program: '', year: '', keywords: '', abstract: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileRef = useRef();

  // ── file handling ────────────────────────────────────────
  const handleFile = (f) => {
    if (!f) return;
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type)) {
      setSubmitError('Only PDF or Word (.doc/.docx) files are accepted.');
      return;
    }
    setSubmitError('');
    setFile(f);
    setExtracted(null);
    setFormData({ title: '', authors: '', department: '', program: '', year: '', keywords: '', abstract: '' });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const runExtraction = () => {
    if (!file) return;
    setExtracting(true);
    setExtracted(null);
    setTimeout(() => {
      const result = fakeExtract(file.name);
      setExtracted(result);
      setFormData(result);
      setExtracting(false);
    }, 2000); // simulate async AI call
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) { setSubmitError('Please upload a manuscript file.'); return; }
    if (!docType) { setSubmitError('Please select a document type.'); return; }
    if (!formData.title || !formData.authors || !formData.department) {
      setSubmitError('Title, Authors, and Department are required.'); return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 520, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>✅</div>
        <h2 style={{ color: 'var(--navy)', marginBottom: 8 }}>Submission Received</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
          <strong>{formData.title}</strong> has been submitted for librarian review and cataloging.
        </p>
        <button className="btn-primary" onClick={() => {
          setSubmitted(false); setFile(null); setExtracted(null);
          setFormData({ title: '', authors: '', department: '', program: '', year: '', keywords: '', abstract: '' });
          setDocType('');
        }}>
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '32px 24px 56px' }}>

      <h2 className="section-heading">Submit Research Material</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 24 }}>
        Upload your department's manuscript. Use the AI extractor to auto-fill metadata, then review and submit.
      </p>

      {submitError && (
        <div className="auth-status error" style={{ marginBottom: 16 }}>⚠️ {submitError}</div>
      )}

      {/* Document type selector */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)', whiteSpace: 'nowrap' }}>
          Document Type
        </label>
        <select
          className="auth-role-select"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          style={{ maxWidth: 340, flex: 1 }}
        >
          {DOC_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* ── Two-column layout: Dropzone | AI Metadata ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* LEFT — Upload Dropzone */}
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Manuscript File
          </p>
          <div
            className={`upload-dropzone${dragging ? ' dragging' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click(); }}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <>
                <div style={{ fontSize: '2.8rem', marginBottom: 8 }}>
                  {file.name.endsWith('.pdf') ? '📄' : '📝'}
                </div>
                <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem', wordBreak: 'break-word', textAlign: 'center' }}>
                  {file.name}
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted)' }}>
                  {(file.size / 1024).toFixed(0)} KB · Click to replace
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>☁️</div>
                <p style={{ margin: '0 0 6px', fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem' }}>
                  Click or drag &amp; drop
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
                  Accepts PDF, DOC, DOCX
                </p>
              </>
            )}
          </div>

          {file && (
            <button
              className="btn-gold"
              style={{ width: '100%', marginTop: 12 }}
              onClick={runExtraction}
              disabled={extracting}
            >
              {extracting ? '⏳ Extracting metadata…' : '✨ Run AI Metadata Extractor'}
            </button>
          )}
        </div>

        {/* RIGHT — AI Metadata Extractor */}
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            AI Extracted Metadata
          </p>
          <div className="ai-extractor-panel">
            {!file && (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--muted)' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>🤖</div>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  Upload a manuscript, then click<br /><strong>Run AI Metadata Extractor</strong>
                </p>
              </div>
            )}

            {file && extracting && (
              <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                <div className="ai-spinner" />
                <p style={{ color: 'var(--navy)', fontWeight: 600, fontSize: '0.88rem', marginTop: 16 }}>
                  Analyzing document…
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: '4px 0 0' }}>
                  Extracting title, authors, abstract, and keywords
                </p>
              </div>
            )}

            {extracted && !extracting && (
              <div style={{ padding: '4px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: '1rem' }}>✅</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#15803d' }}>
                    Extraction complete — review and edit below
                  </span>
                </div>
                {[
                  { key: 'title', label: 'Title' },
                  { key: 'authors', label: 'Author(s)' },
                  { key: 'department', label: 'Department' },
                  { key: 'program', label: 'Program' },
                  { key: 'year', label: 'Year', type: 'number' },
                  { key: 'keywords', label: 'Keywords' },
                ].map(({ key, label, type }) => (
                  <div key={key} className="ai-field-row">
                    <span className="ai-field-label">{label}</span>
                    <input
                      className="ai-field-input"
                      type={type || 'text'}
                      value={formData[key] || ''}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Abstract & Submit ── */}
      {extracted && !extracting && (
        <form onSubmit={handleSubmit}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: 20 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>
              Abstract
            </label>
            <textarea
              style={{ width: '100%', minHeight: 110, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical', outline: 'none' }}
              value={formData.abstract || ''}
              onChange={(e) => handleFieldChange('abstract', e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-primary" style={{ padding: '11px 32px', fontSize: '0.9rem' }}>
              📤 Submit for Review
            </button>
            <button type="button" className="btn-secondary" onClick={() => {
              setFile(null); setExtracted(null);
              setFormData({ title: '', authors: '', department: '', program: '', year: '', keywords: '', abstract: '' });
            }}>
              Clear
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
