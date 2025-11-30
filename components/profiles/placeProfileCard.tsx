import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { MapPin } from 'lucide-react';
import type { location } from '@/db/schema';
import { PlaceReviewsList } from '@/components/reviews/lists/placeReviewsList';

type PlaceProfile = typeof location.$inferSelect & {
  reviewsCount: number;
  avgRating: number;
};

type PlaceProfileCardProps = {
  placeProfile: PlaceProfile;
};

export const PlaceProfileCard = ({ placeProfile }: PlaceProfileCardProps) => {
  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card>
        <CardContent className="p-6">
          {/* Profile Header */}
          <div className="mb-6 flex flex-col items-center space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarFallback className="text-xl sm:text-2xl">
                {placeProfile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold sm:text-2xl">
                {placeProfile.name}
              </h1>
              <p className="text-muted-foreground">@{placeProfile.handle}</p>
              {placeProfile.address && (
                <div className="text-muted-foreground mt-2 flex items-center justify-center gap-1 sm:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{placeProfile.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center sm:gap-6">
            <div>
              <div className="text-xl font-bold sm:text-2xl">
                {placeProfile.reviewsCount}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                reviews
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-1 text-xl font-bold sm:text-2xl">
                {placeProfile.avgRating
                  ? placeProfile.avgRating.toFixed(1)
                  : '0.0'}
              </div>
              <Rating value={placeProfile.avgRating} readOnly>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton size={12} key={index} />
                ))}
              </Rating>
              <div className="text-muted-foreground text-xs sm:text-sm">
                average rating
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold sm:text-xl">Reviews</h2>
            <span className="text-muted-foreground text-sm">
              {placeProfile.reviewsCount}{' '}
              {placeProfile.reviewsCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <Separator className="mb-6" />

          <PlaceReviewsList
            locationId={placeProfile.id}
            reviewsCount={placeProfile.reviewsCount}
            placeName={placeProfile.name}
          />
        </CardContent>
      </Card>
    </div>
  );
};
