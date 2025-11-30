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
// Using built-in Intl.DateTimeFormat instead of date-fns to avoid additional dependency
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

type ProfileReviewCardProps = {
  review: {
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

export const ProfileReviewCard = ({ review }: ProfileReviewCardProps) => {
  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardTitle className="sr-only">
        Review for {review.location.name}
      </CardTitle>

      <CardHeader className="flex flex-col gap-3 pb-4">
        {/* Location and rating info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <a
            href={`/place/${review.location.handle}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <p className="font-semibold text-base">{review.location.name}</p>
            <Rating
              value={review.location.avgRating}
              readOnly
              className="gap-1"
            />
          </a>

          <div className="flex items-center gap-2">
            <Rating value={review.rating} readOnly className="gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <RatingButton
                  className="h-4 w-4 text-yellow-500"
                  size={16}
                  key={index}
                />
              ))}
            </Rating>
            <span className="text-sm text-muted-foreground">
              {formatDate(new Date(review.createdAt))}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Review description */}
        <p className="text-sm text-foreground mb-4 leading-relaxed">
          {review.description}
        </p>

        {/* Photos carousel */}
        {review.photos.length > 0 && (
          <div className="mt-4">
            <Carousel className="relative">
              <CarouselContent>
                {review.photos.map((photo, index) => (
                  <CarouselItem
                    key={index}
                    className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={photo.url}
                      alt={`Review photo ${index + 1} for ${review.location.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {review.photos.length > 1 && (
                <>
                  <CarouselPrevious className="absolute top-1/2 left-2 z-10 -translate-y-1/2" />
                  <CarouselNext className="absolute top-1/2 right-2 z-10 -translate-y-1/2" />
                </>
              )}
            </Carousel>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4">
        <div className="flex gap-4">
          <button
            type="button"
            className="transition duration-200 ease-in-out hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded"
            aria-label="Like this review"
          >
            <Heart className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="transition duration-200 ease-in-out hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
            aria-label="Comment on this review"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          className="transition duration-200 ease-in-out hover:text-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded"
          aria-label="Share this review"
        >
          <Send className="h-5 w-5" />
        </button>
      </CardFooter>
    </Card>
  );
};