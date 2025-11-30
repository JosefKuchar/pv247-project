import { getAllReviewCards } from '@/modules/review/server';

import { FeedReviewCard } from '@/components/reviews/cards/feedReviewCard';

export default async function Page() {
  const allReviewsData = await getAllReviewCards();

  if (!allReviewsData) {
    return <p>No reviews found.</p>;
  }

  return (
    <>
      <ul>
        {allReviewsData.map(reviewData => (
          <li key={reviewData.review.id} className="mb-6">
            <FeedReviewCard reviewData={reviewData} />
          </li>
        ))}
      </ul>
    </>
  );
}
