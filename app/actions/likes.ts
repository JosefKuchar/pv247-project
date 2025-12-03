'use server';

import { addReviewLike, removeReviewLike } from '@/modules/like/server';

import { withAuth } from '@/lib/server-actions';

const internalToggleReviewLikeAction = async (
  userId: string,
  reviewId: string,
  liked: boolean,
) => {
  if (liked) {
    return removeReviewLike(reviewId, userId);
  } else {
    return addReviewLike(reviewId, userId);
  }
};
export const toggleReviewLikeAction = withAuth(internalToggleReviewLikeAction);
