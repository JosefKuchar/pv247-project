'server only';

import { db } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { review } from '@/db/schema';

import {
  reviewType,
  userType,
  locationType,
  reviewPhotoType,
} from '@/db/schema';

export type ReviewDataType = {
  review: reviewType;
  user: Pick<userType, 'name' | 'handle' | 'image'>;
  location: Pick<locationType, 'name' | 'handle'> & { avgRating: number };
  photos: Pick<reviewPhotoType, 'url'>[];
  likesCount: number;
  commentsCount: number;
  comments: { id: string; userId: string; content: string }[];
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
      comments: { columns: { id: true, userId: true, content: true } },
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
      comments: comments,
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
      comments: { columns: { id: true, userId: true, content: true } },
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
    comments: comments,
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
