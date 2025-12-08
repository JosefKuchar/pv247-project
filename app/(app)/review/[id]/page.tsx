import type { Metadata } from 'next';
import { ReviewCard } from '@/components/reviews/cards/review-card';
import { getReviewCard } from '@/modules/review/server';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const reviewData = await getReviewCard(id);

  if (!reviewData) {
    return {
      title: 'Review not found | Locagram',
      description: 'This review could not be found.',
    };
  }

  const title = `Review of ${reviewData.location.name} by ${reviewData.user.name} | Locagram`;
  const description =
    reviewData.description.length > 160
      ? `${reviewData.description.slice(0, 157)}...`
      : reviewData.description;

  const ogImages =
    reviewData.photos.length > 0
      ? reviewData.photos.map(photo => ({
          url: photo.url,
          alt: `Photo of ${reviewData.location.name}`,
        }))
      : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Locagram',
      images: ogImages,
    },
    twitter: {
      card: reviewData.photos.length > 0 ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImages.map(img => img.url),
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const reviewData = await getReviewCard(id);

  if (!reviewData) {
    throw new Error('Review not found');
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center">
      <ReviewCard review={reviewData} />
    </div>
  );
}
