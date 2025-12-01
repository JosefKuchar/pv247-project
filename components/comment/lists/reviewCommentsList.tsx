'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  useInfiniteQuery,
  useMutation,
  InfiniteData,
  useQueryClient,
} from '@tanstack/react-query';
import { CommentsPageType } from '@/modules/comment/server';
import {
  loadReviewCommentsAction,
  addCommentToReviewAction,
} from '@/app/actions/comments';
import { CommentCard } from '../cards/commentCard';

type ReviewCommentListProps = { review_id: string };

export const ReviewCommentList = ({ review_id }: ReviewCommentListProps) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
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
    queryFn: ({ pageParam }) => loadReviewCommentsAction(review_id, pageParam),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
  });

  const mutation = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      addCommentToReviewAction(review_id, content),
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', review_id] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      content: newComment,
    });
  };

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

  if (isLoading) return <div>Loading comments…</div>;
  if (error) return <div>Error loading comments</div>;

  const allComments = data?.pages.flatMap(page => page.comments) ?? [];

  return (
    <>
      <div className="flex max-h-64 flex-col overflow-y-scroll">
        <div ref={contentRef} className="flex-1 space-y-4">
          {allComments.length === 0 && (
            <p className="text-muted-foreground text-center">
              No comments yet.
            </p>
          )}

          {allComments.map(c => (
            <CommentCard key={c.id} comment={c} />
          ))}

          {isFetchingNextPage && (
            <p className="text-muted-foreground text-center text-sm">
              Loading more…
            </p>
          )}
          <div ref={loadMoreRef} />
        </div>{' '}
      </div>
      <div className="sticky bottom-0 mt-2 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-md border px-2 py-1"
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-blue-500 px-4 py-1 text-white disabled:opacity-50"
          >
            {mutation.isPending ? 'Posting…' : 'Post'}
          </button>
        </form>
      </div>
    </>
  );
};
