import { useState, useEffect, useCallback, useRef } from 'react';
import { client } from '../lib/sanityClient';

// Simple cache implementation
const cache = new Map();
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

const safeStringify = (value) => {
  try {
    return JSON.stringify(value ?? {});
  } catch {
    return '';
  }
};

export function useSanityData(query, params = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const paramsKey = safeStringify(params);
  const paramsRef = useRef(params);
  const activeRequestRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      activeRequestRef.current += 1;
    };
  }, []);

  useEffect(() => {
    paramsRef.current = params;
  }, [paramsKey, params]);

  const fetchData = useCallback(
    async (shouldUpdateState = true, bypassCache = false) => {
      const cacheKey = `${query}::${paramsKey}`;
      const requestId = shouldUpdateState
        ? activeRequestRef.current + 1
        : activeRequestRef.current;
      const canUpdateState = () =>
        shouldUpdateState && mountedRef.current && activeRequestRef.current === requestId;

      if (shouldUpdateState) {
        activeRequestRef.current = requestId;
      }

      try {
        // Check cache first unless explicitly bypassed (revalidation).
        if (!bypassCache) {
          const cachedData = cache.get(cacheKey);
          if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME) {
            if (canUpdateState()) {
              setData(cachedData.data);
              setError(null);
            }
            return cachedData.data;
          }
        }

        if (canUpdateState()) {
          setData(null);
          setError(null);
          setIsValidating(true);
        }

        const result = await client.fetch(query, paramsRef.current);

        cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });

        if (canUpdateState()) {
          setData(result);
          setError(null);
        }

        return result;
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = 'Failed to load data. Please try again later.';

        if (canUpdateState()) {
          setError(errorMessage);
        }

        throw new Error(errorMessage);
      } finally {
        if (canUpdateState()) {
          setIsValidating(false);
        }
      }
    },
    [query, paramsKey]
  );

  // Initial fetch
  useEffect(() => {
    fetchData().catch(() => {});
  }, [fetchData]);

  // Revalidate data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const requestId = activeRequestRef.current;

      fetchData(false, true)
        .then((newData) => {
          if (
            mountedRef.current &&
            activeRequestRef.current === requestId &&
            safeStringify(newData) !== safeStringify(data)
          ) {
            setData(newData);
          }
        })
        .catch(() => {
          // Silent fail for background revalidation
        });
    }, CACHE_TIME / 2);

    return () => clearInterval(interval);
  }, [fetchData, data]);

  const mutate = useCallback(async () => fetchData(), [fetchData]);

  return [data, error, { isValidating, mutate }];
}
