'server only';

import { db } from '@/db';
import { location, review } from '@/db/schema';
import { eq, avg, count } from 'drizzle-orm';

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
