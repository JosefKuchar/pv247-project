'use client';

import React, { useState, useTransition, useEffect, useRef, useCallback } from 'react';
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

  // Ref for the intersection observer target
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load more reviews function
  const loadMore = useCallback(() => {
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
  }, [userId, page, hasMore, isPending]);

  // Set up intersection observer
  useEffect(() => {
    if (!hasMore || isPending) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Start loading 100px before the element comes into view
      }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isPending]);

  // Load initial reviews - load more to fill the screen initially
  React.useEffect(() => {
    if (reviewsCount === 0) {
      setIsInitialLoading(false);
      return;
    }

    const loadInitialReviews = async () => {
      try {
        // Load first page
        const result = await loadUserReviews(userId, 1);
        setReviews(result.items);
        setHasMore(result.hasMore);
        setPage(2);
        setError(null);

        // If we have fewer than 6 reviews and there are more, load the next page automatically
        // This helps fill the screen on larger displays
        if (result.items.length < 6 && result.hasMore) {
          const secondResult = await loadUserReviews(userId, 2);
          setReviews([...result.items, ...secondResult.items]);
          setHasMore(secondResult.hasMore);
          setPage(3);
        }
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
        console.error('Error loading reviews:', err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    startTransition(() => {
      loadInitialReviews();
    });
  }, [userId, reviewsCount]);

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

      {/* Intersection Observer Target for Auto-loading */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {isPending ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading more reviews...</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Scroll to load more reviews
            </div>
          )}
        </div>
      )}

      {/* Additional Loading Skeletons during fetch */}
      {isPending && hasMore && (
        <ReviewListSkeleton count={3} />
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
