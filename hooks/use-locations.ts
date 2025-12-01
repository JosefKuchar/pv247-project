import { useEffect, useState } from 'react';

export interface Location {
  id: string;
  name: string;
  address: string | null;
  handle: string;
  latitude: number;
  longitude: number;
  averageRating: number | null;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then(setLocations)
      .catch(err => console.error('Error fetching locations:', err));
  }, []);

  return locations;
}
