import { getReviewCard } from '@/modules/review/server';

import { ReviewCard } from '@/components/reviewCard';

export default async function Page() {
  const reviews = await getReviewCard();

  return (
    <>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </>
  );
}
