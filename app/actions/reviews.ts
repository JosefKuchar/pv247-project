'use server';

import {
  getLocationReviewsPaginated,
  getReviewsPaginated,
  getProfileReviewsPaginated,
  createReviewWithPhotos,
  deleteReview,
} from '@/modules/review/server';
import { withAuth } from '@/lib/server-actions';
import z from 'zod';
import { authActionClient } from '@/lib/safe-action';

async function internalLoadProfileReviewsAction(
  userId: string,
  profileId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const res = await getProfileReviewsPaginated(
    userId,
    profileId,
    page,
    pageSize,
  );
  if (!res) {
    return { reviews: [], hasMore: false, nextPage: undefined };
  }

  return res;
}
export const loadProfileReviewsAction = withAuth(
  internalLoadProfileReviewsAction,
);

async function internalLoadLocationReviewsAction(
  userId: string,
  locationId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const res = await getLocationReviewsPaginated(
    userId,
    locationId,
    page,
    pageSize,
  );

  if (!res) {
    return { reviews: [], hasMore: false, nextPage: undefined };
  }

  return res;
}
export const loadLocationReviewsAction = withAuth(
  internalLoadLocationReviewsAction,
);

async function internalLoadReviewsAction(
  userId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const res = await getReviewsPaginated(userId, page, pageSize);

  if (!res) {
    return { reviews: [], hasMore: false, nextPage: undefined };
  }

  return res;
}
export const loadReviewsAction = withAuth(internalLoadReviewsAction);

const createReviewSchema = z.object({
  locationId: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  rating: z.number().min(1).max(5),
  photoUrls: z.array(z.string().url()).optional(),
});

export const createReview = authActionClient
  .inputSchema(createReviewSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { locationId, description, rating, photoUrls } = parsedInput;
    const userId = (ctx as { userId: string }).userId;

    return await createReviewWithPhotos(
      userId,
      locationId,
      description,
      rating,
      photoUrls,
    );
  });

async function internalDeleteReviewAction(userId: string, reviewId: string) {
  return deleteReview(userId, reviewId);
}

export const deleteReviewAction = withAuth(internalDeleteReviewAction);
