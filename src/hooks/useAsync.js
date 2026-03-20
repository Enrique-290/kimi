import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Estados posibles de una operación asíncrona
 * @typedef {'idle' | 'pending' | 'success' | 'error'} AsyncStatus
 */

/**
 * Hook para manejar operaciones asíncronas con estados de carga y error
 * @template T
 * @param {Function} asyncFunction - Función asíncrona a ejecutar
 * @param {Array} deps - Dependencias para recrear la función
 * @returns {Object} Estado y controladores de la operación
 */
export function useAsync(asyncFunction, deps = []) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // Usar ref para evitar actualizar estado en componente desmontado
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(async (...params) => {
    if (!isMounted.current) return;

    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction(...params);
      if (isMounted.current) {
        setValue(response);
        setStatus('success');
      }
      return response;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus('error');
      }
      throw err;
    }
  }, deps);

  const reset = useCallback(() => {
    setStatus('idle');
    setValue(null);
    setError(null);
  }, []);

  return {
    status,
    value,
    error,
    execute,
    reset,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error'
  };
}

/**
 * Hook para manejar múltiples operaciones asíncronas en paralelo
 * @param {Array<{key: string, fn: Function}>} operations - Operaciones a ejecutar
 * @returns {Object} Estados combinados
 */
export function useAsyncParallel(operations) {
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const promises = operations.map(async ({ key, fn }) => {
        const value = await fn();
        return { key, value };
      });

      const settled = await Promise.allSettled(promises);

      const newResults = {};
      settled.forEach((result, index) => {
        const key = operations[index].key;
        if (result.status === 'fulfilled') {
          newResults[key] = { status: 'success', value: result.value.value };
        } else {
          newResults[key] = { status: 'error', error: result.reason };
        }
      });

      setResults(newResults);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [operations]);

  return { results, isLoading, error, executeAll };
}

/**
 * Hook para debounce de operaciones asíncronas
 * @param {Function} asyncFunction 
 * @param {number} delay - Milisegundos de delay
 * @returns {Object}
 */
export function useDebouncedAsync(asyncFunction, delay = 300) {
  const timeoutRef = useRef(null);
  const { status, value, error, execute, reset } = useAsync(asyncFunction);

  const debouncedExecute = useCallback((...params) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      execute(...params);
    }, delay);
  }, [execute, delay]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return { status, value, error, execute: debouncedExecute, reset };
}

export default useAsync;
