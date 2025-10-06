import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function AuditLog() {
  /** Read-only audit log list with basic text filter */
  const [q, setQ] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const data = await api.listAuditLogs(params);
      setLogs(Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []));
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => load({ q }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <section>
      <div className="toolbar">
        <div className="left">
          <div className="page-title">Audit Log</div>
          <span className="badge">{logs.length} entries</span>
        </div>
        <div className="right">
          <div className="search">
            <span role="img" aria-label="search">🔍</span>
            <input placeholder="Search logs..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <button className="btn ghost" onClick={() => load({ q })}>Refresh</button>
        </div>
      </div>

      <div className="section card" style={{ overflow: 'hidden' }}>
        {loading && <div className="section">Loading...</div>}
        {!loading && (
          <div style={{ overflow: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l, idx) => (
                  <tr key={l.id || idx}>
                    <td>{l.created_at || l.timestamp || '—'}</td>
                    <td>{l.action || l.event || '—'}</td>
                    <td>{l.user || l.actor || 'system'}</td>
                    <td><code style={{ background: '#f3f4f6', padding: 4, borderRadius: 6 }}>{typeof l.details === 'object' ? JSON.stringify(l.details) : (l.details || '—')}</code></td>
                </tr>
                ))}
                {logs.length === 0 && <tr><td colSpan="4" className="helper" style={{ padding: 16 }}>No logs.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
