'use server';

import {
  getLocationReviewsPaginated,
  getReviewsPaginated,
  getProfileReviewsPaginated,
  createReviewWithPhotos,
  deleteReview,
} from '@/modules/review/server';
import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { reviewDescriptionSchema } from '@/lib/validation';

const loadProfileReviewsSchema = z.object({
  profileId: z.string().min(1, 'Profile ID is required'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(50).default(10),
});

export const loadProfileReviewsAction = authActionClient
  .inputSchema(loadProfileReviewsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { profileId, page, pageSize } = parsedInput;
    const userId = ctx.userId;

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
  });

const loadLocationReviewsSchema = z.object({
  locationId: z.string().min(1, 'Location ID is required'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(50).default(10),
});

export const loadLocationReviewsAction = authActionClient
  .inputSchema(loadLocationReviewsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { locationId, page, pageSize } = parsedInput;
    const userId = ctx.userId;

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
  });

const loadReviewsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(50).default(10),
});

export const loadReviewsAction = authActionClient
  .inputSchema(loadReviewsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { page, pageSize } = parsedInput;
    const userId = ctx.userId;

    const res = await getReviewsPaginated(userId, page, pageSize);

    if (!res) {
      return { reviews: [], hasMore: false, nextPage: undefined };
    }

    return res;
  });

const createReviewSchema = z.object({
  locationId: z.string().min(1, 'Location is required'),
  description: reviewDescriptionSchema,
  rating: z.number().min(1).max(5),
  photoUrls: z.array(z.string().url()).optional(),
});

export const createReview = authActionClient
  .inputSchema(createReviewSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { locationId, description, rating, photoUrls } = parsedInput;
    const userId = ctx.userId;

    return await createReviewWithPhotos(
      userId,
      locationId,
      description,
      rating,
      photoUrls,
    );
  });

const deleteReviewSchema = z.object({
  reviewId: z.string().min(1, 'Review ID is required'),
});

export const deleteReviewAction = authActionClient
  .inputSchema(deleteReviewSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { reviewId } = parsedInput;
    const userId = ctx.userId;

    return deleteReview(userId, reviewId);
  });
