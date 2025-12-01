'use server';

import {
  getReviewCommentsPaginated,
  addCommentToReview,
} from '@/modules/comment/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function loadReviewCommentsAction(
  reviewId: string,
  page: number = 1,
  pageSize: number = 9,
) {
  const res = await getReviewCommentsPaginated(reviewId, page, pageSize);

  if (!res) {
    return { comments: [], hasMore: false, nextPage: undefined };
  }

  return res;
}

export async function addCommentToReviewAction(
  reviewId: string,
  content: string,
) {
  const session = await getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const userId = session.user.id;

  return addCommentToReview(reviewId, userId, content);
}
