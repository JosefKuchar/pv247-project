'server only';

import { db } from '@/db';
import { eq, desc } from 'drizzle-orm';
import {
  review,
  reviewPhoto,
  reviewType,
  userType,
  locationType,
} from '@/db/schema';
import { v7 as uuidv7 } from 'uuid';
import { zfd } from 'zod-form-data';
import z from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

export type ReviewDataType = Pick<
  reviewType,
  'id' | 'userId' | 'description' | 'rating' | 'createdAt'
> & {
  user: Pick<userType, 'name' | 'handle' | 'image'>;
  location: Pick<locationType, 'name' | 'handle'> & { avgRating: number };
  photos: { url: string }[];
  likesCount: number;
  commentsCount: number;
  ownReview: boolean;
  liked: boolean;
};

export type ReviewsPageType = {
  reviews: ReviewDataType[];
  hasMore: boolean;
  nextPage?: number;
};

export const getReviewCard = async (id: string) => {
  const reviewData = await db.query.review.findFirst({
    where: (review, { eq }) => eq(review.id, id),
    with: {
      user: {
        columns: { name: true, handle: true, image: true },
      },
      location: {
        columns: { name: true, handle: true },
        with: {
          reviews: {
            columns: { rating: true },
          },
        },
      },
      photos: { columns: { url: true } },
      likes: { columns: { userId: true } },
      comments: { columns: { id: true } },
    },
  });

  if (!reviewData) {
    return null;
  }

  const avgRating =
    reviewData.location.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
    (reviewData.location.reviews.length || 1);

  const { photos, user, location, likes, comments, ...rest } = reviewData;

  return {
    ...rest,
    user: user,
    location: {
      name: location.name,
      avgRating,
      handle: location.handle,
    },
    photos: photos,
    likesCount: likes.length,
    commentsCount: comments.length,
    ownReview: false,
    liked: false,
  };
};

export const getReviewsPaginated = async (
  userId: string,
  page: number = 1,
  pageSize: number = 9,
) => {
  const offset = (page - 1) * pageSize;

  const reviewsData = await db.query.review.findMany({
    with: {
      user: {
        columns: { name: true, handle: true, image: true },
      },
      location: {
        columns: { name: true, handle: true },
        with: {
          reviews: {
            columns: { rating: true },
          },
        },
      },
      photos: { columns: { url: true } },
      likes: { columns: { userId: true } },
      comments: { columns: { id: true } },
    },
    orderBy: desc(review.createdAt),
    limit: pageSize + 1,
    offset: offset,
  });

  if (!reviewsData) {
    return null;
  }

  const hasMore = reviewsData.length > pageSize;
  const reviews = hasMore ? reviewsData.slice(0, -1) : reviewsData;

  const transformedReviews = reviews.map(r => {
    const { location, user, likes, comments, ...rest } = r;

    const avgRating =
      r.location.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
      (r.location.reviews.length || 1);

    return {
      ...rest,
      user,
      location: {
        name: location.name,
        avgRating,
        handle: location.handle,
      },
      likesCount: likes.length,
      commentsCount: comments.length,
      ownReview: r.userId === userId,
      liked: likes.some(like => like.userId === userId),
    };
  });

  return {
    reviews: transformedReviews,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
};

export const getProfileReviewsPaginated = async (
  userId: string,
  profileId: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  const offset = (page - 1) * pageSize;

  const reviewsData = await db.query.review.findMany({
    where: eq(review.userId, profileId),
    with: {
      user: {
        columns: { name: true, handle: true, image: true },
      },
      location: {
        columns: { name: true, handle: true },
        with: {
          reviews: {
            columns: { rating: true },
          },
        },
      },
      photos: { columns: { url: true } },
      likes: { columns: { userId: true } },
      comments: { columns: { id: true } },
    },
    orderBy: desc(review.createdAt),
    limit: pageSize + 1,
    offset: offset,
  });

  if (!reviewsData) {
    return null;
  }

  const hasMore = reviewsData.length > pageSize;
  const reviews = hasMore ? reviewsData.slice(0, -1) : reviewsData;

  const transformedReviews = reviews.map(r => {
    const { location, user, likes, comments, ...rest } = r;

    const avgRating =
      r.location.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
      (r.location.reviews.length || 1);

    return {
      ...rest,
      user,
      location: {
        name: location.name,
        avgRating,
        handle: location.handle,
      },
      likesCount: likes.length,
      commentsCount: comments.length,
      ownReview: r.userId === userId,
      liked: likes.some(like => like.userId === userId),
    };
  });

  return {
    reviews: transformedReviews,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
};

export const getLocationReviewsPaginated = async (
  userId: string,
  locationId: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  const offset = (page - 1) * pageSize;

  const reviewsData = await db.query.review.findMany({
    where: eq(review.locationId, locationId),
    with: {
      user: {
        columns: { name: true, handle: true, image: true },
      },
      location: {
        columns: { name: true, handle: true },
        with: {
          reviews: {
            columns: { rating: true },
          },
        },
      },
      photos: { columns: { url: true } },
      likes: { columns: { userId: true } },
      comments: { columns: { id: true } },
    },
    orderBy: desc(review.createdAt),
    limit: pageSize + 1,
    offset: offset,
  });

  if (!reviewsData) {
    return null;
  }

  const hasMore = reviewsData.length > pageSize;
  const reviews = hasMore ? reviewsData.slice(0, -1) : reviewsData;

  const transformedReviews = reviews.map(r => {
    const { location, user, likes, comments, ...rest } = r;

    const avgRating =
      r.location.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
      (r.location.reviews.length || 1);

    return {
      ...rest,
      user,
      location: {
        name: location.name,
        avgRating,
        handle: location.handle,
      },
      likesCount: likes.length,
      commentsCount: comments.length,
      ownReview: r.userId === userId,
      liked: likes.some(like => like.userId === userId),
    };
  });

  return {
    reviews: transformedReviews,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
};

const createReviewSchema = zfd.formData({
  locationId: zfd.text(z.string().min(1, 'Location is required')),
  description: zfd.text(z.string().min(1, 'Description is required')),
  rating: zfd.numeric(z.number().min(1).max(5)),
  photos: zfd.repeatableOfType(zfd.file()).optional(),
});

export const createReview = authActionClient
  .inputSchema(createReviewSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { locationId, description, rating, photos } = parsedInput;
    const userId = (ctx as { userId: string }).userId;

    // Verify location exists
    const locationExists = await db.query.location.findFirst({
      where: (location, { eq }) => eq(location.id, locationId),
    });

    if (!locationExists) {
      throw new Error('Location not found');
    }

    // Create review
    const reviewId = uuidv7();
    await db.insert(review).values({
      id: reviewId,
      userId,
      locationId,
      description,
      rating,
    });

    // Handle file uploads if provided
    const photoUrls: string[] = [];
    if (photos && photos.length > 0) {
      // Ensure uploads directory exists
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'reviews');
      await mkdir(uploadsDir, { recursive: true });

      // Process each uploaded photo
      for (const photo of photos) {
        const fileExtension = photo.name.split('.').pop() || 'jpg';
        const fileName = `${uuidv7()}.${fileExtension}`;
        const filePath = join(uploadsDir, fileName);

        // Convert File to Buffer and save
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Generate URL for the saved file
        const photoUrl = `/uploads/reviews/${fileName}`;
        photoUrls.push(photoUrl);
      }

      // Create review photos records
      if (photoUrls.length > 0) {
        const photoRecords = photoUrls.map(url => ({
          id: uuidv7(),
          reviewId,
          url,
        }));

        await db.insert(reviewPhoto).values(photoRecords);
      }
    }

    return {
      success: true,
      reviewId,
    };
  });
