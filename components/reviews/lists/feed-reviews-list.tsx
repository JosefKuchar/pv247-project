'use client';

import { useEffect, useRef } from 'react';
import { ReviewCard } from '@/components/reviews/cards/review-card';
import { EmptyReviewsState } from '@/components/reviews/empty-reviews-state';
import { loadReviewsAction } from '@/app/actions/reviews';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { ReviewsPageType } from '@/modules/review/server';
import { Spinner } from '@/components/ui/spinner';

export const FeedReviewsList = () => {
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
    [string],
    number
  >({
    queryKey: ['feedReviews'],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await loadReviewsAction({ page: pageParam });
      return (
        result?.data ?? { reviews: [], hasMore: false, nextPage: undefined }
      );
    },
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
      <div
        className="flex h-screen w-full items-center justify-center"
        role="status"
        aria-label="Loading reviews"
      >
        <Spinner className="mx-auto size-8" />
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Error loading reviews
      </div>
    );

  const allReviews = data?.pages.flatMap(page => page.reviews) || [];

  return (
    <div className="mx-auto flex max-w-5xl flex-col px-2 md:px-4">
      <div ref={contentRef} className="w-full flex-1 space-y-4">
        {allReviews.length === 0 && <EmptyReviewsState />}

        {allReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
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
