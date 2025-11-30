'server only';

import { db } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { review } from '@/db/schema';

export const getReviewCard = async () => {
  const reviews = await db.query.review.findMany({
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
  });

  return reviews.map(r => {
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
};

export const getUserReviews = async (userId: string, page: number = 1, pageSize: number = 9) => {
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

export const getUserReviewsPaginated = async (userId: string, page: number = 1, pageSize: number = 10) => {
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

export const getLocationReviewsPaginated = async (locationId: string, page: number = 1, pageSize: number = 10) => {
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
