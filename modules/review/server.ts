'server only';

import { db } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { review, reviewPhoto } from '@/db/schema';
import { v7 as uuidv7 } from 'uuid';

import {
  reviewType,
  userType,
  locationType,
  reviewPhotoType,
} from '@/db/schema';
import { zfd } from 'zod-form-data';
import z from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

export type ReviewDataType = {
  review: reviewType;
  user: Pick<userType, 'name' | 'handle' | 'image'>;
  location: Pick<locationType, 'name' | 'handle'> & { avgRating: number };
  photos: Pick<reviewPhotoType, 'url'>[];
  likesCount: number;
  commentsCount: number;
};

export const getAllReviewCards = async () => {
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
      likes: { columns: { id: true } },
      comments: { columns: { id: true } },
    },
  });

  if (!reviewsData) {
    return null;
  }

  return reviewsData.map(r => {
    const avgRating =
      r.location.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
      (r.location.reviews.length || 1);

    const { photos, user, location, likes, comments, ...rest } = r;

    return {
      review: {
        ...rest,
      },
      user: user,
      location: {
        name: location.name,
        avgRating,
        handle: location.handle,
      },
      photos: photos,
      likesCount: likes.length,
      commentsCount: comments.length,
    };
  });
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
      likes: { columns: { id: true } },
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
    review: {
      ...rest,
    },
    user: user,
    location: {
      name: location.name,
      avgRating,
      handle: location.handle,
    },
    photos: photos,
    likesCount: likes.length,
    commentsCount: comments.length,
  };
};

export const getUserReviews = async (
  userId: string,
  page: number = 1,
  pageSize: number = 9,
) => {
  const offset = (page - 1) * pageSize;

  const reviews = await db.query.review.findMany({
    where: eq(review.userId, userId),
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
    },
    orderBy: desc(review.createdAt),
    limit: pageSize,
    offset: offset,
  });

  const transformedReviews = reviews.map(r => {
    const { location, user, ...rest } = r;

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
    };
  });

  return {
    reviews: transformedReviews,
    hasMore: reviews.length === pageSize,
    nextPage: reviews.length === pageSize ? page + 1 : null,
  };
};

export const getUserReviewsPaginated = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  const offset = (page - 1) * pageSize;

  const reviews = await db.query.review.findMany({
    where: eq(review.userId, userId),
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
    },
    orderBy: desc(review.createdAt),
    limit: pageSize + 1, // +1 to check if there are more
    offset: offset,
  });

  const hasMore = reviews.length > pageSize;
  const items = hasMore ? reviews.slice(0, -1) : reviews;

  const transformedReviews = items.map(r => {
    const { location, user, ...rest } = r;

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
    };
  });

  return {
    items: transformedReviews,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  };
};

export const getLocationReviewsPaginated = async (
  locationId: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  const offset = (page - 1) * pageSize;

  const reviews = await db.query.review.findMany({
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
    },
    orderBy: desc(review.createdAt),
    limit: pageSize + 1, // +1 to check if there are more
    offset: offset,
  });

  const hasMore = reviews.length > pageSize;
  const items = hasMore ? reviews.slice(0, -1) : reviews;

  const transformedReviews = items.map(r => {
    const { location, user, ...rest } = r;

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
    };
  });

  return {
    items: transformedReviews,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
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
