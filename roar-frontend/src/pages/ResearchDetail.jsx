import React from 'react';
import { useParams } from 'react-router-dom';

export default function ResearchDetail() {
  const { id } = useParams();
  return (
    <div className="page-container">
      <h2>Research Detail View</h2>
      <p>Manuscript ID: {id}</p>
      <p>Displays full title, abstract, authors, publication metadata, and integrated viewer.</p>
    </div>
  );
}
