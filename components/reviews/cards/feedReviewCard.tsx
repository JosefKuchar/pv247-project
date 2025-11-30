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

type reviewCardProps = {
  review: {
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
};

export const FeedReviewCard = ({ review }: reviewCardProps) => {
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
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <button
            type="button"
            className="transition duration-200 ease-in-out hover:cursor-pointer hover:text-red-400"
          >
            <Heart />
          </button>
          <button
            type="button"
            className="transition duration-200 ease-in-out hover:cursor-pointer hover:text-blue-400"
          >
            <MessageCircle />
          </button>
        </div>

        <button
          type="button"
          className="transition duration-200 ease-in-out hover:cursor-pointer hover:text-green-400"
        >
          <Send />
        </button>
      </CardFooter>
    </Card>
  );
};
