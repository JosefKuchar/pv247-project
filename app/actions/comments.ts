'use server';

import {
  getReviewCommentsPaginated,
  addCommentToReview,
} from '@/modules/comment/server';
import { authActionClient, actionClient } from '@/lib/safe-action';
import { commentSchema } from '@/lib/validation';
import { z } from 'zod';

const loadCommentsSchema = z.object({
  reviewId: z.string().min(1, 'Review ID is required'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(50).default(9),
});

export const loadReviewCommentsAction = actionClient
  .inputSchema(loadCommentsSchema)
  .action(async ({ parsedInput }) => {
    const { reviewId, page, pageSize } = parsedInput;
    const res = await getReviewCommentsPaginated(reviewId, page, pageSize);

    if (!res) {
      return { comments: [], hasMore: false, nextPage: undefined };
    }

    return res;
  });

const addCommentSchema = z.object({
  reviewId: z.string().min(1, 'Review ID is required'),
  content: commentSchema,
});

export const addCommentToReviewAction = authActionClient
  .inputSchema(addCommentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { reviewId, content } = parsedInput;
    const userId = ctx.userId;

    return addCommentToReview(reviewId, userId, content);
  });
