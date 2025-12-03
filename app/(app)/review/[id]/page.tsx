import { FeedReviewCard } from '@/components/reviews/cards/feed-review-card';
import { getReviewCard } from '@/modules/review/server';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reviewData = await getReviewCard(id);

  if (!reviewData) {
    throw new Error('Review not found');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <FeedReviewCard review={reviewData} />
    </div>
  );
}
