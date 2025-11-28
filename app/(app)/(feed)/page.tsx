import { getReviewCard } from '@/modules/review/server';

import { ReviewCard } from '@/components/reviewCard';

export default async function Page() {
  const reviews = await getReviewCard();

  return (
    <>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <ReviewCard
              user={review.user}
              location={review.location}
              description={review.description}
              rating={review.rating}
              photos={review.photos}
              createdAt={review.createdAt}
              updatedAt={review.updatedAt}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
