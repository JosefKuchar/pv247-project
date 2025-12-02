'use client';

import { LocationCard } from './location-card';
import { UserCard } from './user-card';

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

interface SearchResultsProps {
  locations: Location[];
  users: User[];
  isLoading?: boolean;
}

export function SearchResults({
  locations,
  users,
  isLoading = false,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-500">Searching...</div>
      </div>
    );
  }

  if (locations.length === 0 && users.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-500">No results found</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {locations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {locations.map(location => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </div>
      )}

      {users.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Users</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
