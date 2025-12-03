'use client';

import { useEffect, useRef } from 'react';
import { ProfileReviewCard } from '@/components/reviews/cards/profile-review-card';
import { EmptyReviewsState } from '@/components/reviews/empty-reviews-state';
import { loadProfileReviewsAction } from '@/app/actions/reviews';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { ReviewsPageType } from '@/modules/review/server';
import { Spinner } from '@/components/ui/spinner';

type UserReviewsListProps = {
  userId: string;
};

export const UserReviewsList = ({ userId }: UserReviewsListProps) => {
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
    queryKey: ['userReviews', userId],
    queryFn: ({ pageParam = 1 }) => loadProfileReviewsAction(userId, pageParam),
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
    <div ref={contentRef}>
      {allReviews.length === 0 && <EmptyReviewsState />}

      {allReviews.map(review => (
        <ProfileReviewCard key={review.id} review={review} />
      ))}

      {hasNextPage && <div ref={loadMoreRef} />}
      {isFetchingNextPage && (
        <div className="w-full">
          <Spinner className="mx-auto" fontSize={32} />
        </div>
      )}
    </div>
  );
};
