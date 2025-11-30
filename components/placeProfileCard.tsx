import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { MapPin } from 'lucide-react';
import type { location } from '@/db/schema';
import { PlaceReviewsList } from '@/components/placeReviewsList';

type PlaceProfile = typeof location.$inferSelect & {
  reviewsCount: number;
  avgRating: number;
}

type PlaceProfileCardProps = {
  placeProfile: PlaceProfile;
}

export const PlaceProfileCard = ({ placeProfile }: PlaceProfileCardProps) => {
  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card>
        <CardContent className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
              <AvatarFallback className="text-xl sm:text-2xl">
                {placeProfile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold">{placeProfile.name}</h1>
              <p className="text-muted-foreground">@{placeProfile.handle}</p>
              {placeProfile.address && (
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{placeProfile.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold">{placeProfile.reviewsCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">reviews</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl sm:text-2xl font-bold mb-1">
                {placeProfile.avgRating ? placeProfile.avgRating.toFixed(1) : '0.0'}
              </div>
              <Rating value={placeProfile.avgRating} readOnly>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton size={12} key={index} />
                ))}
              </Rating>
              <div className="text-xs sm:text-sm text-muted-foreground">average rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">Reviews</h2>
            <span className="text-sm text-muted-foreground">
              {placeProfile.reviewsCount} {placeProfile.reviewsCount === 1 ? 'review' : 'reviews'}
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
