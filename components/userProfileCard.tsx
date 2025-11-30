import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { userType } from '@/db/schema';
import { UserReviewsList } from '@/components/userReviewsList';

type UserProfile = userType & {
  followersCount: number,
  followingCount: number,
  reviewsCount: number
}

type UserProfileCardProps = {
  userProfile: UserProfile;
  isOwnProfile?: boolean;
}

export const UserProfileCard = ({ userProfile, isOwnProfile = false }: UserProfileCardProps) => {
  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card>
        <CardContent className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto sm:mx-0">
              <AvatarImage src={userProfile.image || undefined} alt={userProfile.name} />
              <AvatarFallback className="text-xl sm:text-2xl">
                {userProfile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold">{userProfile.name}</h1>
              <p className="text-muted-foreground">@{userProfile.handle}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold">{userProfile.reviewsCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">reviews</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">{userProfile.followersCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">followers</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">{userProfile.followingCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">following</div>
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
              {userProfile.reviewsCount} {userProfile.reviewsCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <Separator className="mb-6" />

          <UserReviewsList
            userId={userProfile.id}
            reviewsCount={userProfile.reviewsCount}
            isOwnProfile={isOwnProfile}
            userName={userProfile.name}
          />
        </CardContent>
      </Card>
    </div>
  );
};