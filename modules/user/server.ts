'server only';

import { db } from '@/db';
import { follow, review, user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getUserProfile = async (handle: string) => {
  const userData = await db.query.user.findFirst({
    where: eq(user.handle, handle),
  });

  if (!userData) {
    return null;
  }

  const [reviewsCount, followersCount, followingCount] = await Promise.all([
    db.$count(review, eq(review.userId, userData.id)),
    db.$count(follow, eq(follow.followingId, userData.id)),
    db.$count(follow, eq(follow.followerId, userData.id)),
  ]);

  return { ...userData, reviewsCount, followersCount, followingCount };
};
