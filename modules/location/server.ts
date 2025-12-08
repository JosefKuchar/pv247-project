'server only';

import { db } from '@/db';
import {
  location,
  review,
  userLocationFollow,
  locationManagement,
} from '@/db/schema';
import { eq, avg, count, and, like, or, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';
import { slugify } from '@/lib/utils';

export const getLocationProfile = async (handle: string) => {
  const locationData = await db.query.location.findFirst({
    where: eq(location.handle, handle),
  });

  if (!locationData) {
    return null;
  }

  const [reviewsCount, followersCount, avgRating] = await Promise.all([
    db.$count(review, eq(review.locationId, locationData.id)),
    db.$count(
      userLocationFollow,
      eq(userLocationFollow.locationId, locationData.id),
    ),
    db
      .select({ avgRating: avg(review.rating) })
      .from(review)
      .where(eq(review.locationId, locationData.id))
      .then(results => Number(results[0]?.avgRating) || 0),
  ]);

  return {
    ...locationData,
    reviewsCount,
    followersCount,
    avgRating,
  };
};

export const getLocationFollowStatus = async (locationHandle: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If not authenticated, return false
  if (!session?.user?.id) {
    return { isFollowing: false };
  }

  // Get location by handle
  const targetLocation = await db.query.location.findFirst({
    where: eq(location.handle, locationHandle),
  });

  // If location doesn't exist, return false
  if (!targetLocation) {
    return { isFollowing: false };
  }

  const existingFollow = await db.query.userLocationFollow.findFirst({
    where: and(
      eq(userLocationFollow.userId, session.user.id),
      eq(userLocationFollow.locationId, targetLocation.id),
    ),
  });

  return {
    isFollowing: !!existingFollow,
  };
};

export const getLocationManagementStatus = async (locationHandle: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If not authenticated, return false
  if (!session?.user?.id) {
    return { isManager: false, hasPendingClaim: false };
  }

  // Get location by handle
  const targetLocation = await db.query.location.findFirst({
    where: eq(location.handle, locationHandle),
  });

  // If location doesn't exist, return false
  if (!targetLocation) {
    return { isManager: false, hasPendingClaim: false };
  }

  const existingManagement = await db.query.locationManagement.findFirst({
    where: and(
      eq(locationManagement.userId, session.user.id),
      eq(locationManagement.locationId, targetLocation.id),
    ),
  });

  const isManager = !!(
    existingManagement && existingManagement.approved
  );
  const hasPendingClaim = !!(
    existingManagement && !existingManagement.approved
  );

  return {
    isManager,
    hasPendingClaim,
  };
};

export async function getLocationByHandle(handle: string) {
  return db.query.location.findFirst({
    where: eq(location.handle, handle),
  });
}

export async function checkLocationFollowStatus(
  userId: string,
  locationId: string,
) {
  return db.query.userLocationFollow.findFirst({
    where: and(
      eq(userLocationFollow.userId, userId),
      eq(userLocationFollow.locationId, locationId),
    ),
  });
}

export async function createLocationFollow(userId: string, locationId: string) {
  await db.insert(userLocationFollow).values({
    id: randomUUID(),
    userId: userId,
    locationId: locationId,
  });
}

export async function deleteLocationFollow(userId: string, locationId: string) {
  await db
    .delete(userLocationFollow)
    .where(
      and(
        eq(userLocationFollow.userId, userId),
        eq(userLocationFollow.locationId, locationId),
      ),
    );
}

export type LocationSearchResult = {
  value: string;
  label: string;
};

/**
 * Search locations by name or address for combobox
 * @param query - Search query string
 * @param limit - Maximum number of results (default: 20)
 * @returns Array of locations matching the search query
 */
export async function searchLocations(
  query: string,
  limit: number = 20,
): Promise<LocationSearchResult[]> {
  const searchPattern = `%${query}%`;

  const results = await db
    .select({
      id: location.id,
      name: location.name,
      address: location.address,
    })
    .from(location)
    .where(
      or(
        like(sql`LOWER(${location.name})`, sql`LOWER(${searchPattern})`),
        like(sql`LOWER(${location.address})`, sql`LOWER(${searchPattern})`),
      ),
    )
    .limit(limit);

  return results.map(loc => ({
    value: loc.id,
    label: loc.address ? `${loc.name} - ${loc.address}` : loc.name,
  }));
}

/**
 * Create a new location
 * @param name - Location name
 * @param address - Location address (optional)
 * @param latitude - Latitude coordinate (default: 0)
 * @param longitude - Longitude coordinate (default: 0)
 * @returns Created location or null if creation failed
 */
export async function createLocation(
  name: string,
  address?: string | null,
  latitude: number = 0,
  longitude: number = 0,
) {
  if (!name || name.trim().length === 0) {
    throw new Error('Location name is required');
  }

  // Generate handle from name
  const baseHandle = slugify(name);
  let handle = baseHandle;
  let counter = 1;

  // Ensure handle is unique
  while (true) {
    const existing = await db.query.location.findFirst({
      where: eq(location.handle, handle),
    });

    if (!existing) {
      break;
    }

    handle = `${baseHandle}-${counter}`;
    counter++;
  }

  const newLocation = await db
    .insert(location)
    .values({
      id: randomUUID(),
      name: name.trim(),
      handle,
      address: address?.trim() || null,
      latitude,
      longitude,
    })
    .returning();

  return newLocation[0];
}
