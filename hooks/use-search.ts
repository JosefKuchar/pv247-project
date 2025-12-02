import { useState, useEffect } from 'react';
import { useDebounce } from './use-debounce';

interface Location {
  id: string;
  name: string;
  handle: string;
  address: string | null;
  latitude: number;
  longitude: number;
}

interface User {
  id: string;
  name: string;
  handle: string;
  image: string | null;
}

interface SearchResponse {
  locations: Location[];
  users: User[];
}

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResponse>({
    locations: [],
    users: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ locations: [], users: [] });
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults({ locations: [], users: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return { results, isLoading };
}
