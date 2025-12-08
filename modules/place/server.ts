'server only';

import { db } from '@/db';
import { location, locationManagement } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function checkUserCanManagePlace(
  userId: string,
  placeId: string,
): Promise<boolean> {
  const management = await db.query.locationManagement.findFirst({
    where: and(
      eq(locationManagement.userId, userId),
      eq(locationManagement.locationId, placeId),
      eq(locationManagement.approved, true), // Only approved claims can manage
    ),
  });

  return !!management;
}

export async function updatePlaceProfile(
  placeId: string,
  data: {
    name: string;
    handle: string;
    description: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  },
) {
  await db.update(location).set(data).where(eq(location.id, placeId));
}

export async function checkPlaceHandleAvailability(
  handle: string,
  excludePlaceId?: string,
) {
  const existingPlace = await db.query.location.findFirst({
    where: eq(location.handle, handle),
  });

  if (!existingPlace) {
    return { available: true };
  }

  // If excluding current place, check if it's their own handle
  if (excludePlaceId && existingPlace.id === excludePlaceId) {
    return { available: true };
  }

  return { available: false };
}
