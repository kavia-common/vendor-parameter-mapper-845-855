import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import MappingModal from '../components/MappingModal';
import useMappings from '../hooks/useMappings';

// PUBLIC_INTERFACE
export default function Mappings() {
  /** Mappings for a selected vendor. Supports search/filter, CRUD via modal. */
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [stdFilter, setStdFilter] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const { mappings, loading, error, refresh } = useMappings({ vendor_id: vendorId, q: query, standard_parameter_key: stdFilter });

  const [vendorParams, setVendorParams] = useState([]);
  const [standardParams, setStandardParams] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [vp, sp] = await Promise.all([
        api.listVendorParameters({ vendor_id: vendorId }),
        api.listStandardParameters(),
      ]);
      setVendorParams(vp || []);
      setStandardParams(sp || []);
    };
    load().catch(() => {});
  }, [vendorId]);

  useEffect(() => {
    const t = setTimeout(() => refresh({ vendor_id: vendorId, q: query, standard_parameter_key: stdFilter }), 300);
    return () => clearTimeout(t);
  }, [query, stdFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = useMemo(() => mappings, [mappings]);

  const onCreate = async (payload) => {
    try {
      await api.createMapping(payload);
      setOpenModal(false);
      setEditItem(null);
      await refresh();
    } catch (e) {
      alert(e.message || 'Failed to create');
    }
  };

  const onUpdate = async (id, payload) => {
    try {
      await api.updateMapping(id, payload);
      setOpenModal(false);
      setEditItem(null);
      await refresh();
    } catch (e) {
      alert(e.message || 'Failed to update');
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete mapping?')) return;
    try {
      await api.deleteMapping(id);
      await refresh();
    } catch (e) {
      alert(e.message || 'Failed to delete');
    }
  };

  return (
    <section>
      <div className="toolbar">
        <div className="left">
          <div className="page-title">Mappings</div>
          <span className="badge">Vendor: {vendorId}</span>
        </div>
        <div className="right">
          <div className="search">
            <span role="img" aria-label="search">🔍</span>
            <input placeholder="Search vendor parameter name..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <select className="select" value={stdFilter} onChange={e => setStdFilter(e.target.value)}>
            <option value="">All standard keys</option>
            {standardParams.map(sp => (
              <option key={sp.key || sp.id} value={sp.key || sp.id}>{sp.key || sp.id}</option>
            ))}
          </select>
          <button className="btn" onClick={() => { setOpenModal(true); setEditItem(null); }}>Add Mapping</button>
          <button className="btn ghost" onClick={() => navigate('/vendors')}>Back</button>
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
                  <th>Vendor Parameter</th>
                  <th>Standard Key</th>
                  <th>Confidence</th>
                  <th style={{ width: 220 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(m => (
                  <tr key={m.id}>
                    <td>{m.vendor_parameter_name}</td>
                    <td><span className="badge">{m.standard_parameter_key}</span></td>
                    <td>{Number(m.confidence).toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn" onClick={() => { setEditItem(m); setOpenModal(true); }}>Edit</button>
                        <button className="btn ghost" onClick={() => onDelete(m.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan="4" className="helper" style={{ padding: 16 }}>No mappings.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MappingModal
        open={openModal}
        onClose={() => { setOpenModal(false); setEditItem(null); }}
        onSubmit={(payload) => editItem ? onUpdate(editItem.id, payload) : onCreate(payload)}
        initial={editItem}
        vendorId={vendorId}
        vendorParameters={vendorParams}
        standardParameters={standardParams}
      />
    </section>
  );
}
