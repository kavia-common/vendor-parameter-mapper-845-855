const API_BASE = process.env.REACT_APP_API_BASE || '';

/**
 * Simple wrapper around fetch that sets JSON headers and handles errors.
 * Adds CORS-friendly headers and credentials false by default.
 */
async function request(path, { method = 'GET', params, body } = {}) {
  const url = new URL((API_BASE + path).replace(/\/+$/, ''));
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.append(k, v);
    });
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'omit',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || message;
      throw Object.assign(new Error(message), { status: res.status, data });
    } catch {
      throw Object.assign(new Error(message), { status: res.status });
    }
  }

  // 204 no content
  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

// PUBLIC_INTERFACE
export const api = {
  /** Vendors */
  // PUBLIC_INTERFACE
  listVendors: (opts = {}) => request('/vendors/', { params: opts }),
  // PUBLIC_INTERFACE
  getVendor: (vendorId) => request(`/vendors/${encodeURIComponent(vendorId)}`),
  // PUBLIC_INTERFACE
  createVendor: (payload) => request('/vendors/', { method: 'POST', body: payload }),
  // PUBLIC_INTERFACE
  updateVendor: (vendorId, payload) => request(`/vendors/${encodeURIComponent(vendorId)}`, { method: 'PUT', body: payload }),
  // PUBLIC_INTERFACE
  deleteVendor: (vendorId) => request(`/vendors/${encodeURIComponent(vendorId)}`, { method: 'DELETE' }),

  /** Standard Parameters */
  // PUBLIC_INTERFACE
  listStandardParameters: (opts = {}) => request('/standard-parameters/', { params: opts }),
  // PUBLIC_INTERFACE
  createStandardParameter: (payload) => request('/standard-parameters/', { method: 'POST', body: payload }),

  /** Vendor Parameters */
  // PUBLIC_INTERFACE
  listVendorParameters: (opts = {}) => request('/vendor-parameters/', { params: opts }),
  // PUBLIC_INTERFACE
  createVendorParameter: (payload) => request('/vendor-parameters/', { method: 'POST', body: payload }),

  /** Mappings */
  // PUBLIC_INTERFACE
  listMappings: (opts = {}) => request('/mappings/', { params: opts }),
  // PUBLIC_INTERFACE
  getMapping: (id) => request(`/mappings/${encodeURIComponent(id)}`),
  // PUBLIC_INTERFACE
  createMapping: (payload) => request('/mappings/', { method: 'POST', body: payload }),
  // PUBLIC_INTERFACE
  updateMapping: (id, payload) => request(`/mappings/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
  // PUBLIC_INTERFACE
  deleteMapping: (id) => request(`/mappings/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  // PUBLIC_INTERFACE
  suggestMappings: ({ vendor_id, query }) => request('/mappings/suggest', { params: { vendor_id, query } }),

  /** Audit Logs */
  // PUBLIC_INTERFACE
  listAuditLogs: (opts = {}) => request('/audit-logs/', { params: opts }),
};

export default api;
