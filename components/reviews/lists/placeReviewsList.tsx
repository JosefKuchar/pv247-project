'use client';

import { useEffect, useRef } from 'react';
import { PlaceReviewCard } from '@/components/reviews/cards/placeReviewCard';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { EmptyReviewsState } from '@/components/reviews/emptyReviewsState';
import { ReviewsPageType } from '@/modules/review/server';
import { loadLocationReviewsAction } from '@/app/actions/reviews';
import { Spinner } from '@/components/ui/spinner';

type PlaceReviewsListProps = {
  locationId: string;
};

export const PlaceReviewsList = ({ locationId }: PlaceReviewsListProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<
    ReviewsPageType,
    Error,
    InfiniteData<ReviewsPageType>,
    [string, string],
    number
  >({
    queryKey: ['placeReviews', locationId],
    queryFn: ({ pageParam = 1 }) =>
      loadLocationReviewsAction(locationId, pageParam),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
  });

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading)
    return (
      <div className="space-y-6" role="status" aria-label="Loading reviews">
        <Spinner />
      </div>
    );
  if (error) return <div>Error loading reviews</div>;

  const allReviews = data?.pages.flatMap(page => page.reviews) || [];

  return (
    <div className="flex flex-col gap-6">
      <div ref={contentRef} className="w-full flex-1 space-y-4">
        {allReviews.length === 0 && <EmptyReviewsState />}

        {allReviews.map(review => (
          <PlaceReviewCard key={review.id} review={review} />
        ))}

        {hasNextPage && <div ref={loadMoreRef} />}
        {isFetchingNextPage && (
          <div className="w-full">
            <Spinner className="mx-auto" fontSize={32} />
          </div>
        )}
      </div>
    </div>
  );
};
