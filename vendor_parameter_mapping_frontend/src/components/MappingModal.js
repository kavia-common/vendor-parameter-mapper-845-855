import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export default function MappingModal({ open, onClose, onSubmit, initial, vendorId, vendorParameters = [], standardParameters = [] }) {
  /** Modal for creating/updating a mapping with form validation */
  const [form, setForm] = useState({
    vendor_parameter_id: '',
    vendor_parameter_name: '',
    standard_parameter_key: '',
    confidence: 1.0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        vendor_parameter_id: initial.vendor_parameter_id || '',
        vendor_parameter_name: initial.vendor_parameter_name || '',
        standard_parameter_key: initial.standard_parameter_key || '',
        confidence: initial.confidence ?? 1.0,
      });
    } else {
      setForm({
        vendor_parameter_id: '',
        vendor_parameter_name: '',
        standard_parameter_key: '',
        confidence: 1.0,
      });
    }
  }, [initial, open]);

  const validate = () => {
    const e = {};
    if (!vendorId) e.vendor_id = 'Missing vendor id';
    if (!form.vendor_parameter_id) e.vendor_parameter_id = 'Select a vendor parameter';
    if (!form.standard_parameter_key) e.standard_parameter_key = 'Select a standard parameter';
    const c = Number(form.confidence);
    if (Number.isNaN(c) || c < 0 || c > 1) e.confidence = 'Confidence must be between 0 and 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      vendor_id: vendorId,
      vendor_parameter_id: form.vendor_parameter_id,
      vendor_parameter_name: form.vendor_parameter_name || (vendorParameters.find(v => v.id === form.vendor_parameter_id)?.name || ''),
      standard_parameter_key: form.standard_parameter_key,
      confidence: Number(form.confidence),
    });
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <strong>{initial ? 'Edit Mapping' : 'Add Mapping'}</strong>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gap: 12 }}>
              <label>
                <div>Vendor Parameter</div>
                <select
                  className="select"
                  value={form.vendor_parameter_id}
                  onChange={e => setForm(f => ({ ...f, vendor_parameter_id: e.target.value }))}
                  required
                >
                  <option value="">Select...</option>
                  {vendorParameters.map(vp => (
                    <option key={vp.id} value={vp.id}>{vp.name}{vp.label ? ` (${vp.label})` : ''}</option>
                  ))}
                </select>
                {errors.vendor_parameter_id && <div className="error">{errors.vendor_parameter_id}</div>}
              </label>

              <label>
                <div>Standard Parameter</div>
                <select
                  className="select"
                  value={form.standard_parameter_key}
                  onChange={e => setForm(f => ({ ...f, standard_parameter_key: e.target.value }))}
                  required
                >
                  <option value="">Select...</option>
                  {standardParameters.map(sp => (
                    <option key={sp.key || sp.id} value={sp.key || sp.id}>{sp.key || sp.id} {sp.label ? `— ${sp.label}` : ''}</option>
                  ))}
                </select>
                {errors.standard_parameter_key && <div className="error">{errors.standard_parameter_key}</div>}
              </label>

              <label>
                <div>Confidence</div>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={form.confidence}
                  onChange={e => setForm(f => ({ ...f, confidence: e.target.value }))}
                  required
                />
                <div className="helper">0.0 to 1.0</div>
                {errors.confidence && <div className="error">{errors.confidence}</div>}
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">{initial ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
