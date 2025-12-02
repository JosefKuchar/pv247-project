'server only';

import { db } from '@/db';
import { comment, commentType } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export type CommentDataType = Pick<
  commentType,
  'id' | 'content' | 'createdAt'
> & {
  user: { handle: string };
};

export type CommentsPageType = {
  comments: CommentDataType[];
  hasMore: boolean;
  nextPage?: number;
};

export const getReviewCommentsPaginated = async (
  id: string,
  page: number = 1,
  pageSize: number = 9,
) => {
  const offset = (page - 1) * pageSize;

  const commentsData = await db.query.comment.findMany({
    where: eq(comment.reviewId, id),
    with: {
      user: {
        columns: { handle: true },
      },
    },
    orderBy: desc(comment.createdAt),
    limit: pageSize + 1, // +1 to check if there's more
    offset: offset,
  });

  const hasMore = commentsData.length > pageSize;
  const comments = hasMore ? commentsData.slice(0, -1) : commentsData;

  if (!commentsData) {
    return null;
  }

  return { comments, hasMore, nextPage: hasMore ? page + 1 : undefined };
};

export const addCommentToReview = async (
  reviewId: string,
  userId: string,
  content: string,
) => {
  const newComment = await db
    .insert(comment)
    .values({
      id: randomUUID(),
      reviewId,
      userId,
      content,
    })
    .returning();

  return newComment[0];
};
