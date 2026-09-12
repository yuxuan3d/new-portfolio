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
  const paramsKey = safeStringify(params);
  const requestKey = `${query}::${paramsKey}`;
  const [requestState, setRequestState] = useState({
    key: null,
    data: null,
    error: null,
    isValidating: false,
    hasResolved: false,
  });
  const paramsRef = useRef(params);
  const activeRequestRef = useRef(0);
  const mountedRef = useRef(false);
  const currentState = requestState.key === requestKey
    ? requestState
    : {
        key: requestKey,
        data: null,
        error: null,
        isValidating: true,
        hasResolved: false,
      };

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
      const cacheKey = requestKey;
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
              setRequestState({
                key: requestKey,
                data: cachedData.data,
                error: null,
                isValidating: false,
                hasResolved: true,
              });
            }
            return cachedData.data;
          }
        }

        if (canUpdateState()) {
          setRequestState({
            key: requestKey,
            data: null,
            error: null,
            isValidating: true,
            hasResolved: false,
          });
        }

        const result = await client.fetch(query, paramsRef.current);

        cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });

        if (canUpdateState()) {
          setRequestState({
            key: requestKey,
            data: result,
            error: null,
            isValidating: false,
            hasResolved: true,
          });
        }

        return result;
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = 'Failed to load data. Please try again later.';

        if (canUpdateState()) {
          setRequestState({
            key: requestKey,
            data: null,
            error: errorMessage,
            isValidating: false,
            hasResolved: true,
          });
        }

        throw new Error(errorMessage);
      }
    },
    [query, requestKey]
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
            safeStringify(newData) !== safeStringify(currentState.data)
          ) {
            setRequestState((current) => (
              current.key === requestKey
                ? { ...current, data: newData, error: null, hasResolved: true }
                : current
            ));
          }
        })
        .catch(() => {
          // Silent fail for background revalidation
        });
    }, CACHE_TIME / 2);

    return () => clearInterval(interval);
  }, [currentState.data, fetchData, requestKey]);

  const mutate = useCallback(async () => fetchData(), [fetchData]);

  return [
    currentState.data,
    currentState.error,
    {
      isValidating: currentState.isValidating,
      hasResolved: currentState.hasResolved,
      mutate,
    },
  ];
}
