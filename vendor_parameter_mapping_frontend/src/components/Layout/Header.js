import React from 'react';

// PUBLIC_INTERFACE
export default function Header() {
  /** Top header with brand and docs link. */
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-badge">Ocean • Pro</span>
        <span>Vendor Mapper</span>
      </div>
      <div className="header-actions">
        <a href="https://swagger.io/specification/" target="_blank" rel="noreferrer">API Docs</a>
      </div>
    </header>
  );
}
