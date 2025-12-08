'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { ReviewDataType } from '@/modules/review/server';
import { useState } from 'react';
import { ReviewCommentList } from '@/components/comment/review-comments-list';
import { toggleReviewLikeAction } from '@/app/actions/likes';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type ReviewCardProps = {
  review: ReviewDataType;
  showUserInfo?: boolean;
  showLocationInfo?: boolean;
};

export const ReviewCard = ({
  review,
  showUserInfo = true,
  showLocationInfo = true,
}: ReviewCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(review.commentsCount);
  const [likesCount, setLikesCount] = useState(review.likesCount);
  const [liked, setLiked] = useState(review.liked);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleReviewLikeAction(review.id, liked),
    onSuccess: () => {
      setLiked(!liked);
      if (liked) {
        setLikesCount(likesCount - 1);
      } else {
        setLikesCount(likesCount + 1);
      }
    },
  });

  const callbackAddComment = () => {
    setCommentsCount(commentsCount + 1);
  };

  const handleShare = async () => {
    const url = window.location.origin + `/review/${review.id}`;
    const shareData = {
      title: `Review of ${review.location.name}`,
      text:
        review.description ||
        `Check out this review of ${review.location.name}`,
      url: url,
    };

    // Use Web Share API if available (mobile)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback to clipboard copy (desktop)
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <Card className="flex w-full max-w-full flex-col overflow-hidden shadow-md">
      <CardTitle className="sr-only">User Review</CardTitle>
      <CardHeader className="flex min-w-0 flex-col gap-4">
        {showUserInfo && (
          <div>
            <a
              href={`/${review.user.handle}`}
              className="flex min-w-0 items-center gap-2"
            >
              {review.user.image ? (
                <Image
                  src={review.user.image}
                  alt={review.user.name}
                  width={40}
                  height={40}
                  className="shrink-0 rounded-full"
                  unoptimized
                />
              ) : (
                <div className="h-10 w-10 shrink-0 rounded-full bg-gray-300" />
              )}
              <h3 className="min-w-0 truncate font-semibold">
                <span className="block truncate">{review.user.name}</span>
                <span className="block truncate font-normal text-gray-500">
                  @{review.user.handle}
                </span>
              </h3>
            </a>
          </div>
        )}

        {showLocationInfo && (
          <div className="flex min-w-0 items-center justify-between gap-2">
            <a
              href={`/place/${review.location.handle}`}
              className="flex min-w-0 flex-1 items-center gap-2"
            >
              <p className="min-w-0 truncate font-semibold">
                {review.location.name}
              </p>
              <Rating
                value={review.location.avgRating}
                readOnly
                className="shrink-0 gap-1"
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton size={12} key={index} />
                ))}
              </Rating>
            </a>
          </div>
        )}

        <Rating value={review.rating} readOnly className="gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton
              className="-mt-2.5 h-3 w-5 text-yellow-500"
              key={index}
            />
          ))}
        </Rating>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <p className="text-sm break-words text-gray-700">
          {review.description}
        </p>
        {review.photos.length > 0 && (
          <div className="pt-4">
            <Carousel className="w-full">
              <CarouselContent className="ml-0">
                {review.photos.map((photo, index) => (
                  <CarouselItem key={index} className="pl-0">
                    <div className="relative w-full overflow-hidden rounded-md">
                      <div className="relative aspect-video max-h-96 w-full">
                        <Image
                          src={photo.url}
                          alt={`Photo ${index + 1}`}
                          fill
                          placeholder="blur"
                          blurDataURL={photo.url}
                          className="object-contain"
                          sizes="100vw, (max-width: 768px) 80vw, 96vw"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {review.photos.length > 1 && (
                <>
                  <CarouselPrevious className="absolute top-1/2 left-2 z-10 -translate-y-1/2 sm:left-4" />
                  <CarouselNext className="absolute top-1/2 right-2 z-10 -translate-y-1/2 sm:right-4" />
                </>
              )}
            </Carousel>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex min-w-0 flex-col gap-2 border-t">
        {showComments && (
          <div className="w-full min-w-0 pb-4">
            <ReviewCommentList
              review_id={review.id}
              callbackAddComment={callbackAddComment}
            />
          </div>
        )}
        <div className="flex w-full min-w-0 justify-between gap-2">
          <div className="flex gap-4">
            <div className="flex items-center transition duration-200 ease-in-out hover:text-red-400">
              {toggleLikeMutation.isPending ? (
                <Heart className="animate-pulse hover:cursor-pointer" />
              ) : (
                <Heart
                  type="button"
                  className={`hover:cursor-pointer ${liked ? 'text-red-500' : ''}`}
                  onClick={() => toggleLikeMutation.mutate()}
                />
              )}
              <span className="ml-1">{likesCount}</span>
            </div>
            <div className="flex items-center transition duration-200 ease-in-out hover:text-blue-400">
              <MessageCircle
                type="button"
                className="hover:cursor-pointer"
                onClick={toggleComments}
              />
              <span className="ml-1">{commentsCount}</span>
            </div>
          </div>
          <button
            type="button"
            className="transition duration-200 ease-in-out hover:cursor-pointer hover:text-green-400"
            onClick={handleShare}
          >
            <Send />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
