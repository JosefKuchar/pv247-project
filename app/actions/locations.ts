'use server';

import { searchLocations, createLocation } from '@/modules/location/server';

export async function searchLocationsAction(query: string, limit: number = 20) {
  return searchLocations(query, limit);
}

export async function createLocationAction(
  name: string,
  address?: string | null,
  latitude?: number,
  longitude?: number,
) {
  try {
    const newLocation = await createLocation(
      name,
      address,
      latitude ?? 0,
      longitude ?? 0,
    );
    return {
      success: true,
      data: {
        value: newLocation.id,
        label: newLocation.address
          ? `${newLocation.name} - ${newLocation.address}`
          : newLocation.name,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create location',
    };
  }
}
