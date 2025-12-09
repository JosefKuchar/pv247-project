'use client';

import { useRef, useEffect } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { CommentsPageType } from '@/modules/comment/server';
import { loadReviewCommentsAction } from '@/app/actions/comments';
import { CommentCard } from './comment-card';
import { AddCommentForm } from './add-comment-form';

type ReviewCommentListProps = {
  review_id: string;
  callbackAddComment: () => void;
  canComment?: boolean;
};

export const ReviewCommentList = ({
  review_id,
  callbackAddComment,
  canComment = true,
}: ReviewCommentListProps) => {
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
    CommentsPageType,
    Error,
    InfiniteData<CommentsPageType>,
    [string, string],
    number
  >({
    queryKey: ['comments', review_id],
    queryFn: async ({ pageParam }) => {
      const result = await loadReviewCommentsAction({
        reviewId: review_id,
        page: pageParam,
      });
      return (
        result?.data ?? { comments: [], hasMore: false, nextPage: undefined }
      );
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
  });

  // Infinite scroll observer
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
      <div className="flex w-full justify-center">
        Loading comments <Spinner />
      </div>
    );
  if (error) return <div>Error loading comments</div>;

  const allComments = data?.pages.flatMap(page => page.comments) ?? [];

  return (
    <>
      <div className="flex max-h-64 min-w-full flex-col overflow-y-scroll">
        <div ref={contentRef} className="w-full flex-1 space-y-4">
          {allComments.length === 0 && (
            <p className="text-center">No comments yet.</p>
          )}

          {allComments.map(c => (
            <CommentCard key={c.id} comment={c} />
          ))}

          {isFetchingNextPage && <Spinner />}
          <div ref={loadMoreRef} />
        </div>
      </div>
      {canComment ? (
        <div className="sticky bottom-0 mt-2 bg-white">
          <AddCommentForm
            review_id={review_id}
            callbackAddComment={callbackAddComment}
          />
        </div>
      ) : (
        <p className="mt-2 text-center text-sm text-gray-500">
          Log in to add a comment
        </p>
      )}
    </>
  );
};
