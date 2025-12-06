'use server';

import {
  getLocationReviewsPaginated,
  getReviewsPaginated,
  getProfileReviewsPaginated,
} from '@/modules/review/server';
import { withAuth } from '@/lib/server-actions';

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
