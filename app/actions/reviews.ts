'use server';

import { getUserReviewsPaginated } from '@/modules/review/server';

export async function loadUserReviews(userId: string, page: number = 1, pageSize: number = 3 * 3) {
  return getUserReviewsPaginated(userId, page, pageSize);
}
