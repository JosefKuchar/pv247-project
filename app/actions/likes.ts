'use server';

import { addLikeToReview } from '@/modules/like/server';

import { withAuth } from '@/lib/server-actions';

const internalAddLikeToReviewAction = async (
  userId: string,
  reviewId: string,
) => {
  return addLikeToReview(reviewId, userId);
};

export const addLikeToReviewAction = withAuth(internalAddLikeToReviewAction);
