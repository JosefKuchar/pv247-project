'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/search-bar';
import { SearchResults } from '@/components/search/search-results';
import { useSearch } from '@/hooks/use-search';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, isLoading } = useSearch(searchQuery);
  const isMobile = useIsMobile();
  const router = useRouter();
  const previousIsMobile = useRef<boolean | null>(null);

  useEffect(() => {
    if (previousIsMobile.current === true && !isMobile) {
      router.push('/');
    }
    previousIsMobile.current = isMobile;
  }, [isMobile, router]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
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
