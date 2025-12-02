'use server';

import {
  getUserReviewsPaginated,
  getLocationReviewsPaginated,
} from '@/modules/review/server';

export async function loadUserReviewsAction(
  userId: string,
  page: number = 1,
  pageSize: number = 3 * 3,
) {
  return getUserReviewsPaginated(userId, page, pageSize);
}

export async function loadLocationReviewsAction(
  locationId: string,
  page: number = 1,
  pageSize: number = 3 * 3,
) {
  return getLocationReviewsPaginated(locationId, page, pageSize);
}
