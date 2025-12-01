'server only';

import { db } from '@/db';
import { location, review, userLocationFollow, locationManagement } from '@/db/schema';
import { eq, avg, count, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const getLocationProfile = async (handle: string) => {
  const locationData = await db.query.location.findFirst({
    where: eq(location.handle, handle),
  });

  if (!locationData) {
    return null;
  }

  // Get reviews count and average rating
  const [reviewStats] = await db
    .select({
      reviewsCount: count(review.id),
      avgRating: avg(review.rating),
    })
    .from(review)
    .where(eq(review.locationId, locationData.id));

  return {
    ...locationData,
    reviewsCount: reviewStats?.reviewsCount || 0,
    avgRating: Number(reviewStats?.avgRating) || 0,
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
