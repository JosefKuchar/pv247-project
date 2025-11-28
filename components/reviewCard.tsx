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
import { Heart, MessageCircle } from 'lucide-react';

type reviewCardProps = {
  createdAt: Date;
  updatedAt: Date;
  description: string;
  rating: number;
  user: {
    name: string;
    image: string | null;
  };
  location: {
    name: string;
    avgRating: number;
  };
  photos: {
    url: string;
  }[];
};

export const ReviewCard = ({
  user,
  location,
  description,
  rating,
  photos,
}: reviewCardProps) => {
  return (
    <Card className="w-full max-w-md shadow-md">
      <CardTitle className="sr-only">User Review</CardTitle>
      <CardHeader className="flex flex-col gap-4">
        <div>
          <a
            href={`/${user.name.trim().toLowerCase()}`}
            className="flex items-center gap-2"
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
                unoptimized
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            )}
            <h3 className="font-semibold">{user.name}</h3>
          </a>
        </div>
        <div className="flex items-center justify-between">
          <a
            href={`/${location.name.trim().toLowerCase()}`}
            className="flex items-center gap-2"
          >
            <p className="font-semibold">{location.name}</p>
            <Rating value={location.avgRating} readOnly className="gap-1" />
          </a>
          <Rating value={rating} readOnly>
            {Array.from({ length: 5 }).map((_, index) => (
              <RatingButton size={12} key={index} />
            ))}
          </Rating>
        </div>
        <Rating value={rating} readOnly className="gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton
              className="-mt-2.5 h-3 w-5 text-yellow-500"
              key={index}
            />
          ))}
        </Rating>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-700">{description}</p>

        {photos.length > 0 && (
          <Carousel className="relative flex items-center justify-center pt-4">
            <CarouselContent>
              {photos.map((photo, index) => (
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
            {photos.length > 1 && (
              <>
                <CarouselPrevious className="absolute top-1/2 left-2 z-1 -translate-y-1/2" />
                <CarouselNext className="absolute top-1/2 right-2 z-1 -translate-y-1/2" />
              </>
            )}
          </Carousel>
        )}
      </CardContent>
      <CardFooter className="flex gap-4">
        <button type="button">
          <Heart />
        </button>
        <button type="button">
          <MessageCircle />
        </button>
      </CardFooter>
    </Card>
  );
};
