'use server';

import {
  getUserReviewsPaginated,
  getLocationReviewsPaginated,
  getReviewsPaginated,
} from '@/modules/review/server';

export async function loadUserReviewsAction(
  userId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const res = await getUserReviewsPaginated(userId, page, pageSize);

  if (!res) {
    return { reviews: [], hasMore: false, nextPage: undefined };
  }

  return res;
}

export async function loadLocationReviewsAction(
  locationId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const res = await getLocationReviewsPaginated(locationId, page, pageSize);

  if (!res) {
    return { reviews: [], hasMore: false, nextPage: undefined };
  }

  return res;
}

export async function loadReviewsAction(
  page: number = 1,
  pageSize: number = 10,
) {
  const res = await getReviewsPaginated(page, pageSize);

  if (!res) {
    return { reviews: [], hasMore: false, nextPage: undefined };
  }

  return res;
}
