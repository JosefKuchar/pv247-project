'use server';

import {
  getUserReviewsPaginated,
  getLocationReviewsPaginated,
} from '@/modules/review/server';

export async function loadUserReviews(
  userId: string,
  page: number = 1,
  pageSize: number = 3 * 3,
) {
  return getUserReviewsPaginated(userId, page, pageSize);
}

export async function loadLocationReviews(
  locationId: string,
  page: number = 1,
  pageSize: number = 3 * 3,
) {
  return getLocationReviewsPaginated(locationId, page, pageSize);
}
