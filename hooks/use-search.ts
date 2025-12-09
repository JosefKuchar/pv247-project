import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@tanstack/react-pacer/debouncer';
import {
  globalSearchAction,
  type GlobalSearchResult,
} from '@/app/actions/locations';

export function useSearch(query: string) {
  const [debouncedQuery] = useDebouncedValue(query, { wait: 300 });

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => globalSearchAction(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    placeholderData: { locations: [], users: [] } as GlobalSearchResult,
  });

  return {
    results: data ?? { locations: [], users: [] },
    isLoading,
  };
}
