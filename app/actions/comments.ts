'use server';

import {
  getReviewCommentsPaginated,
  addCommentToReview,
} from '@/modules/comment/server';

import { withAuth } from '@/lib/server-actions';
import { commentSchema } from '@/lib/validation';

export const loadReviewCommentsAction = async (
  reviewId: string,
  page: number = 1,
  pageSize: number = 9,
) => {
  const res = await getReviewCommentsPaginated(reviewId, page, pageSize);

  if (!res) {
    return { comments: [], hasMore: false, nextPage: undefined };
  }

  return res;
};

const internalAddCommentToReviewAction = async (
  userId: string,
  reviewId: string,
  content: string,
) => {
  // Validate comment content
  const validationResult = commentSchema.safeParse(content);
  if (!validationResult.success) {
    throw new Error(validationResult.error.issues[0]?.message || 'Invalid comment');
  }

  return addCommentToReview(reviewId, userId, content);
};

export const addCommentToReviewAction = withAuth(
  internalAddCommentToReviewAction,
);
