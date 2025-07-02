import { useState, useEffect, useCallback } from 'react';
import { client } from '../lib/sanityClient';

// Simple cache implementation
const cache = new Map();
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export function useSanityData(query) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const fetchData = useCallback(async (shouldUpdateState = true) => {
    try {
      setIsValidating(true);
      
      // Check cache first
      const cacheKey = query;
      const cachedData = cache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME) {
        if (shouldUpdateState) {
          setData(cachedData.data);
          setError(null);
        }
        return cachedData.data;
      }

      // Fetch fresh data
      const result = await client.fetch(query);
      
      // Update cache
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
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
      setIsValidating(false);
    }
  }, [query]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Revalidate data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(false).then((newData) => {
        if (JSON.stringify(newData) !== JSON.stringify(data)) {
          setData(newData);
        }
      }).catch(() => {
        // Silent fail for background revalidation
      });
    }, CACHE_TIME / 2);

    return () => clearInterval(interval);
  }, [fetchData, data]);

  const mutate = useCallback(async () => {
    return fetchData();
  }, [fetchData]);

  return [data, error, { isValidating, mutate }];
} 