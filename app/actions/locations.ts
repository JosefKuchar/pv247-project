'use server';

import { searchLocations } from '@/modules/location/server';

export async function searchLocationsAction(query: string, limit: number = 20) {
  return searchLocations(query, limit);
}
