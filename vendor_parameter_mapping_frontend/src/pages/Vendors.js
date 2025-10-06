import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import useVendors from '../hooks/useVendors';

// PUBLIC_INTERFACE
export default function Vendors() {
  /** Vendors listing with search and create/delete basic actions */
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { vendors, loading, error, refresh } = useVendors({ q: query });
  const [creating, setCreating] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', description: '' });

  useEffect(() => {
    const t = setTimeout(() => refresh({ q: query }), 300);
    return () => clearTimeout(t);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => vendors, [vendors]);

  const createVendor = async () => {
    if (!newVendor.name.trim()) return;
    setCreating(true);
    try {
      await api.createVendor(newVendor);
      setNewVendor({ name: '', description: '' });
      await refresh();
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message || 'Failed to create vendor');
    } finally {
      setCreating(false);
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm('Delete this vendor?')) return;
    try {
      await api.deleteVendor(id);
      await refresh();
    } catch (e) {
      alert(e.message || 'Failed to delete vendor');
    }
  };

  return (
    <section>
      <div className="toolbar">
        <div className="left">
          <div className="page-title">Vendors</div>
          <span className="badge">{filtered.length} results</span>
        </div>
        <div className="right">
          <div className="search">
            <span role="img" aria-label="search">🔍</span>
            <input placeholder="Search vendors..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 2fr auto' }}>
            <input
              className="input"
              placeholder="Vendor name"
              value={newVendor.name}
              onChange={e => setNewVendor(v => ({ ...v, name: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Description (optional)"
              value={newVendor.description}
              onChange={e => setNewVendor(v => ({ ...v, description: e.target.value }))}
            />
            <button className="btn" disabled={creating || !newVendor.name.trim()} onClick={createVendor}>Add Vendor</button>
          </div>
        </div>
      </div>

      <div className="section card" style={{ overflow: 'hidden' }}>
        {loading && <div className="section">Loading...</div>}
        {error && <div className="section error">{error.message || 'Error'}</div>}
        {!loading && !error && (
          <div style={{ overflow: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 260 }}>Name</th>
                  <th>Description</th>
                  <th style={{ width: 220 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id}>
                    <td><strong>{v.name}</strong></td>
                    <td>{v.description || <span className="helper">—</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn" onClick={() => navigate(`/vendors/${v.id}/mappings`)}>Mappings</button>
                        <button className="btn ghost" onClick={() => deleteVendor(v.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="3" className="helper" style={{ padding: 16 }}>No vendors found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
