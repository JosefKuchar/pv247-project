import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@tanstack/react-pacer/debouncer';

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

const fetchSearchResults = async (query: string): Promise<SearchResponse> => {
  if (!query.trim()) {
    return { locations: [], users: [] };
  }

  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Search failed');
  }
  return response.json();
};

export function useSearch(query: string) {
  const [debouncedQuery] = useDebouncedValue(query, { wait: 300 });

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => fetchSearchResults(debouncedQuery),
    staleTime: 1000 * 60 * 5,
    placeholderData: { locations: [], users: [] },
  });

  return {
    results: data ?? { locations: [], users: [] },
    isLoading,
  };
}
