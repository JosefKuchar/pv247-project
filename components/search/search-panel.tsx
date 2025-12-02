'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search/search-bar';
import { SearchResults } from '@/components/search/search-results';
import { useSearch } from '@/hooks/use-search';

export function SearchPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, isLoading } = useSearch(searchQuery);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="mb-4 text-2xl font-bold">Search</h2>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SearchResults
          locations={results.locations}
          users={results.users}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
