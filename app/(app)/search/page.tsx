'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search/search-bar';
import { SearchResults } from '@/components/search/search-results';
import { useSearch } from '@/hooks/use-search';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, isLoading } = useSearch(searchQuery);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Search</h1>
      <div className="mb-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <SearchResults
        locations={results.locations}
        users={results.users}
        isLoading={isLoading}
      />
    </div>
  );
}
