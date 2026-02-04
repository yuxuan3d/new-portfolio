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

  useEffect(() => {
    paramsRef.current = params;
  }, [paramsKey, params]);

  const fetchData = useCallback(
    async (shouldUpdateState = true, bypassCache = false) => {
      const cacheKey = `${query}::${paramsKey}`;

      try {
        // Check cache first unless explicitly bypassed (revalidation).
        if (!bypassCache) {
          const cachedData = cache.get(cacheKey);
          if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME) {
            if (shouldUpdateState) {
              setData(cachedData.data);
              setError(null);
            }
            return cachedData.data;
          }
        }

        if (shouldUpdateState) {
          setIsValidating(true);
        }

        const result = await client.fetch(query, paramsRef.current);

        cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });

        if (shouldUpdateState) {
          setData(result);
          setError(null);
        }

        return result;
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = 'Failed to load data. Please try again later.';

        if (shouldUpdateState) {
          setError(errorMessage);
        }

        throw new Error(errorMessage);
      } finally {
        if (shouldUpdateState) {
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
      fetchData(false, true)
        .then((newData) => {
          if (safeStringify(newData) !== safeStringify(data)) {
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
