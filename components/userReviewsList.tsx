'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ProfileReviewCard } from '@/components/profileReviewCard';
import { ReviewListSkeleton } from '@/components/reviewCardSkeleton';
import { EmptyReviewsState } from '@/components/emptyReviewsState';
import { loadUserReviews } from '@/app/actions/reviews';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Review = {
  user: {
    image: string | null;
    handle: string;
    name: string;
  };
  location: {
    name: string;
    avgRating: number;
    handle: string;
  };
  rating: number;
  description: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  locationId: string;
  photos: {
    url: string;
  }[];
};

type UserReviewsListProps = {
  userId: string;
  reviewsCount: number;
  isOwnProfile?: boolean;
  userName?: string;
};

export const UserReviewsList = ({
  userId,
  reviewsCount,
  isOwnProfile = false,
  userName
}: UserReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Load initial reviews
  React.useEffect(() => {
    if (reviewsCount === 0) {
      setIsInitialLoading(false);
      return;
    }

    startTransition(async () => {
      try {
        const result = await loadUserReviews(userId, 1);
        setReviews(result.items);
        setHasMore(result.hasMore);
        setPage(2);
        setError(null);
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
        console.error('Error loading reviews:', err);
      } finally {
        setIsInitialLoading(false);
      }
    });
  }, [userId, reviewsCount]);

  const loadMore = () => {
    if (!hasMore || isPending) return;

    startTransition(async () => {
      try {
        const result = await loadUserReviews(userId, page);
        setReviews(prev => [...prev, ...result.items]);
        setHasMore(result.hasMore);
        setPage(prev => prev + 1);
        setError(null);
      } catch (err) {
        setError('Failed to load more reviews. Please try again.');
        console.error('Error loading more reviews:', err);
      }
    });
  };

  // Show initial loading state
  if (isInitialLoading) {
    return (
      <div
        className="space-y-6"
        role="status"
        aria-label="Loading reviews"
      >
        <ReviewListSkeleton count={3} />
      </div>
    );
  }

  // Show empty state
  if (reviewsCount === 0 || reviews.length === 0) {
    return (
      <EmptyReviewsState
        isOwnProfile={isOwnProfile}
        userName={userName}
      />
    );
  }

  return (
    <div className="space-y-6" role="region" aria-label="User reviews">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Reviews Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        role="list"
        aria-label={`${reviews.length} reviews`}
      >
        {reviews.map((review, index) => (
          <div
            key={review.id}
            role="listitem"
            aria-label={`Review ${index + 1} for ${review.location.name}`}
          >
            <ProfileReviewCard review={review} />
          </div>
        ))}
      </div>

      {/* Loading More Skeletons */}
      {isPending && hasMore && (
        <ReviewListSkeleton count={3} />
      )}

      {/* Load More Button */}
      {hasMore && !isPending && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={loadMore}
            variant="outline"
            size="lg"
            disabled={isPending}
            className="min-w-[140px]"
            aria-label={`Load more reviews. Currently showing ${reviews.length} of ${reviewsCount} reviews`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && reviews.length > 0 && (
        <div
          className="text-center py-8 text-muted-foreground text-sm"
          role="status"
          aria-live="polite"
        >
          You've reached the end of {isOwnProfile ? 'your' : `${userName}'s`} reviews
        </div>
      )}
    </div>
  );
};