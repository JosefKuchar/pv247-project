'server only';

import { db } from '@/db';
import { review } from '@/db/schema';
import { user } from '@/db/schema';

export const getReviewCard = async () => {
  const reviews = await db.query.review.findMany({
    with: {
      user: {
        columns: { name: true, image: true },
      },
      location: {
        columns: { name: true },
        with: {
          reviews: {
            columns: { rating: true },
          },
        },
      },
      photos: { columns: { url: true } },
    },
  });

  return reviews.map(r => {
    const { location, user, ...rest } = r;

    const avgRating =
      r.location.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
      (r.location.reviews.length || 1);

    return {
      ...rest,
      user,
      location: {
        name: location.name,
        avgRating,
      },
    };
  });
};
