'use server';

import { addReviewLike, removeReviewLike } from '@/modules/like/server';
import { authActionClient } from '@/lib/safe-action';
import { z } from 'zod';

const toggleLikeSchema = z.object({
  reviewId: z.string().min(1, 'Review ID is required'),
  liked: z.boolean(),
});

export const toggleReviewLikeAction = authActionClient
  .inputSchema(toggleLikeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { reviewId, liked } = parsedInput;
    const userId = ctx.userId;

    if (liked) {
      return removeReviewLike(reviewId, userId);
    } else {
      return addReviewLike(reviewId, userId);
    }
  });
