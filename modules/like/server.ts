'server only';

import { db } from '@/db';
import { reviewLike } from '@/db/schema';
import { randomUUID } from 'crypto';
import { eq, and } from 'drizzle-orm';

export const addReviewLike = async (reviewId: string, userId: string) => {
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

export const removeReviewLike = async (reviewId: string, userId: string) => {
  const deletedLike = await db
    .delete(reviewLike)
    .where(
      and(eq(reviewLike.reviewId, reviewId), eq(reviewLike.userId, userId)),
    )
    .returning();

  return deletedLike[0];
};

export const checkUserReviewLikeStatus = async (
  reviewId: string,
  userId: string,
) => {
  const existingLike = await db.query.reviewLike.findFirst({
    where: and(
      eq(reviewLike.reviewId, reviewId),
      eq(reviewLike.userId, userId),
    ),
  });

  return existingLike;
};

export const getReviewAuthorId = async (reviewId: string) => {
  const reviewLikeData = await db.query.reviewLike.findFirst({
    where: eq(reviewLike.reviewId, reviewId),
    columns: {
      userId: true,
    },
  });

  return reviewLikeData?.userId;
};
