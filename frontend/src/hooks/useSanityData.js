import { useState, useEffect } from 'react';
import { client } from '../lib/sanityClient';

export function useSanityData(query) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.fetch(query);
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, [query]);

  return [data, error];
} 