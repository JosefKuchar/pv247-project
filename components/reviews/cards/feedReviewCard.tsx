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
import { ReviewCommentList } from '@/components/comment/reviewCommentsList';
import { addLikeToReviewAction } from '@/app/actions/likes';

type ReviewCardProps = {
  review: ReviewDataType;
};

export const FeedReviewCard = ({ review }: ReviewCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(review.commentsCount);
  const [likesCount, setLikesCount] = useState(review.likesCount);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const callbackAddLike = () => {
    addLikeToReviewAction(review.id);
    setLikesCount(likesCount + 1);
  };
  const callbackAddComment = () => {
    setCommentsCount(commentsCount + 1);
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardTitle className="sr-only">User Review</CardTitle>
      <CardHeader className="flex flex-col gap-4">
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
        <div className="flex items-center justify-between">
          <a
            href={`/place/${review.location.handle}`}
            className="flex items-center gap-2"
          >
            <p className="font-semibold">{review.location.name}</p>
            <Rating value={review.location.avgRating} readOnly>
              {Array.from({ length: 5 }).map((_, index) => (
                <RatingButton size={12} key={index} />
              ))}
            </Rating>
          </a>
        </div>
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
              <Heart
                type="button"
                className="hover:cursor-pointer"
                onClick={callbackAddLike}
              />
              <span className="ml-1">{review.likesCount}</span>
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
            onClick={() =>
              navigator.clipboard.writeText(
                window.location.href + `review/${review.id}`,
              )
            }
          >
            <Send />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
