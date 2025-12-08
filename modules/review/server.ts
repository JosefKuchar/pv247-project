'server only';

import { db } from '@/db';
import { eq, desc, or, inArray, sql } from 'drizzle-orm';
import {
  review,
  reviewPhoto,
  reviewType,
  userType,
  locationType,
  follow,
  userLocationFollow,
} from '@/db/schema';
import { v7 as uuidv7 } from 'uuid';

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

  // Get IDs of users that current user follows
  const followedUsers = await db.query.follow.findMany({
    where: eq(follow.followerId, userId),
    columns: { followingId: true },
  });
  const followedUserIds = followedUsers.map(f => f.followingId);

  // Get IDs of locations that current user follows
  const followedLocations = await db.query.userLocationFollow.findMany({
    where: eq(userLocationFollow.userId, userId),
    columns: { locationId: true },
  });
  const followedLocationIds = followedLocations.map(f => f.locationId);

  // Build a query that prioritizes followed content
  // Priority: 0 = followed user or location, 1 = other
  const hasFollowedContent =
    followedUserIds.length > 0 || followedLocationIds.length > 0;

  let reviewsData;

  if (hasFollowedContent) {
    // Build condition for followed content
    const followedConditions = [];
    if (followedUserIds.length > 0) {
      followedConditions.push(inArray(review.userId, followedUserIds));
    }
    if (followedLocationIds.length > 0) {
      followedConditions.push(inArray(review.locationId, followedLocationIds));
    }

    const followedCondition = or(...followedConditions);

    // Use raw SQL for priority sorting
    reviewsData = await db.query.review.findMany({
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
      orderBy: [
        // Priority: followed content first (0), then others (1)
        sql`CASE WHEN ${followedCondition} THEN 0 ELSE 1 END ASC`,
        desc(review.createdAt),
      ],
      limit: pageSize + 1,
      offset: offset,
    });
  } else {
    // No followed content, just sort by date
    reviewsData = await db.query.review.findMany({
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
  }

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

export const createReviewWithPhotos = async (
  userId: string,
  locationId: string,
  description: string,
  rating: number,
  photoUrls?: string[],
) => {
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

  // Create review photos records if URLs provided
  if (photoUrls && photoUrls.length > 0) {
    const photoRecords = photoUrls.map(url => ({
      id: uuidv7(),
      reviewId,
      url,
    }));

    await db.insert(reviewPhoto).values(photoRecords);
  }

  return {
    success: true,
    reviewId,
  };
};
