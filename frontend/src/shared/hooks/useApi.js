import { useState, useEffect, useCallback } from 'react';

/**
 * useApi — hook genérico para llamadas al BFF.
 * Detecta respuestas degradadas (Circuit Breaker / Redis cache).
 *
 * @param {Function} serviceFn  - función del service que retorna una promesa axios
 * @param {Array}    deps       - dependencias para re-fetch (como useEffect)
 * @param {boolean}  immediate  - si debe ejecutarse al montar (default: true)
 */
export function useApi(serviceFn, deps = [], immediate = true) {
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(immediate);
  const [error,     setError]     = useState(null);
  const [degraded,  setDegraded]  = useState(false);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setDegraded(false);
    try {
      const response = await serviceFn(...args);
      const resData  = response.data;
      setData(resData);
      setDegraded(!!resData?._meta?.degraded);
      return resData;
    } catch (err) {
      setDegraded(!!err._degraded);
      setError(err?.response?.data?.message ?? err?.message ?? 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) execute();
  }, [execute]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, degraded, refetch: execute };
}
