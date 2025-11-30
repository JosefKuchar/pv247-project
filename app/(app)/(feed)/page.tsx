import { getReviewCard } from '@/modules/review/server';
import { FeedReviewCard } from '@/components/reviews/cards/feedReviewCard';

export default async function Page() {
  const reviews = await getReviewCard();

  return (
    <>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <FeedReviewCard review={review} />
          </li>
        ))}
      </ul>
    </>
  );
}
