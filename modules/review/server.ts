'server only';

import { db } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { review, reviewType, userType, locationType } from '@/db/schema';

export type ReviewDataType = Pick<
  reviewType,
  'id' | 'description' | 'rating' | 'createdAt'
> & {
  user: Pick<userType, 'name' | 'handle' | 'image'>;
  location: Pick<locationType, 'name' | 'handle'> & { avgRating: number };
  photos: { url: string }[];
  likesCount: number;
  commentsCount: number;
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

export const getReviewsPaginated = async (
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
      likes: { columns: { id: true } },
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
    };
  });

  return {
    reviews: transformedReviews,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
};

export const getUserReviewsPaginated = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  const offset = (page - 1) * pageSize;

  const reviewsData = await db.query.review.findMany({
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
      likes: { columns: { id: true } },
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
    };
  });

  return {
    reviews: transformedReviews,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
};

export const getLocationReviewsPaginated = async (
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
      likes: { columns: { id: true } },
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
    };
  });

  return {
    reviews: transformedReviews,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
};
