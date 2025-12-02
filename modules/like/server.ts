'server only';

import { db } from '@/db';
import { reviewLike } from '@/db/schema';
import { randomUUID } from 'crypto';

export const addLikeToReview = async (reviewId: string, userId: string) => {
  const newLike = await db
    .insert(reviewLike)
    .values({
      id: randomUUID(),
      reviewId,
      userId,
    })
    .returning();

  return newLike[0];
};
