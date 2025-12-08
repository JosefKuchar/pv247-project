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

  return (
    <Card className="w-full shadow-md">
      <CardTitle className="sr-only">User Review</CardTitle>
      <CardHeader className="flex flex-col gap-4">
        {showUserInfo && (
          <div>
            <a
              href={`/${review.user.handle}`}
              className="flex items-center gap-2"
            >
              {review.user.image ? (
                <Image
                  src={review.user.image}
                  alt={review.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                  unoptimized
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300" />
              )}
              <h3 className="font-semibold">
                {review.user.name}
                <span className="font-normal text-gray-500">
                  @{review.user.handle}
                </span>
              </h3>
            </a>
          </div>
        )}

        {showLocationInfo && (
          <div className="flex items-center justify-between">
            <a
              href={`/place/${review.location.handle}`}
              className="flex items-center gap-2"
            >
              <p className="font-semibold">{review.location.name}</p>
              <Rating
                value={review.location.avgRating}
                readOnly
                className="gap-1"
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton size={12} key={index} />
                ))}
              </Rating>
            </a>
            {!showUserInfo && (
              <Rating value={review.rating} readOnly>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton size={12} key={index} />
                ))}
              </Rating>
            )}
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

      <CardContent>
        <p className="text-sm text-gray-700">{review.description}</p>
        {review.photos.length > 0 && (
          <Carousel className="relative flex items-center justify-center pt-4">
            <CarouselContent>
              {review.photos.map((photo, index) => (
                <CarouselItem
                  key={index}
                  className="relative h-96 w-96 object-contain"
                >
                  <Image
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    fill
                    placeholder="blur"
                    blurDataURL={photo.url}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {review.photos.length > 1 && (
              <>
                <CarouselPrevious className="absolute top-1/2 left-2 z-1 -translate-y-1/2" />
                <CarouselNext className="absolute top-1/2 right-2 z-1 -translate-y-1/2" />
              </>
            )}
          </Carousel>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t">
        {showComments && (
          <div className="w-full pb-4">
            <ReviewCommentList
              review_id={review.id}
              callbackAddComment={callbackAddComment}
            />
          </div>
        )}
        <div className="flex w-full justify-between">
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
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.origin + `/review/${review.id}`,
              );
              toast.success('Link copied to clipboard!');
            }}
          >
            <Send />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
