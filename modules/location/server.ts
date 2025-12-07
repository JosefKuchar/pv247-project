'server only';

import { db } from '@/db';
import {
  location,
  review,
  userLocationFollow,
  locationManagement,
} from '@/db/schema';
import { eq, avg, count, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';

export const getLocationProfile = async (handle: string) => {
  const locationData = await db.query.location.findFirst({
    where: eq(location.handle, handle),
  });

  if (!locationData) {
    return null;
  }

  const [reviewsCount, followersCount, avgRating] = await Promise.all([
    db.$count(review, eq(review.locationId, locationData.id)),
    db.$count(userLocationFollow, eq(userLocationFollow.locationId, locationData.id)),
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
    return { isManager: false };
  }

  // Get location by handle
  const targetLocation = await db.query.location.findFirst({
    where: eq(location.handle, locationHandle),
  });

  // If location doesn't exist, return false
  if (!targetLocation) {
    return { isManager: false };
  }

  const existingManagement = await db.query.locationManagement.findFirst({
    where: and(
      eq(locationManagement.userId, session.user.id),
      eq(locationManagement.locationId, targetLocation.id),
      eq(locationManagement.approved, true),
    ),
  });

  return {
    isManager: !!existingManagement,
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
