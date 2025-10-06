import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function useVendors(initialParams = {}) {
  /** Fetch vendors with loading and error state. */
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paramsRef = useRef(initialParams);

  const refresh = useCallback(async (params) => {
    if (params) paramsRef.current = params;
    setLoading(true);
    setError(null);
    try {
      const list = await api.listVendors(paramsRef.current);
      setVendors(Array.isArray(list?.items) ? list.items : (Array.isArray(list) ? list : []));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(paramsRef.current); }, [refresh]);

  return { vendors, loading, error, refresh };
}
