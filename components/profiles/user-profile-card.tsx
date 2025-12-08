import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FollowButton } from '@/components/ui/follow-button';
import type { userType } from '@/db/schema';
import { UserReviewsList } from '@/components/reviews/lists/user-reviews-list';
import { UserProfileOptions } from '@/components/profiles/user-profile-options';

type UserProfile = userType & {
  followersCount: number;
  followingCount: number;
  reviewsCount: number;
  isFollowing: boolean;
};

type UserProfileCardProps = {
  userProfile: UserProfile;
  isOwnProfile?: boolean;
  isAdmin?: boolean;
};

export const UserProfileCard = ({
  userProfile,
  isOwnProfile = false,
  isAdmin = false,
}: UserProfileCardProps) => {
  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card>
        <CardContent className="p-6">
          {/* Profile Header */}
          <div className="mb-6 flex flex-col items-center space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage
                src={userProfile.image || undefined}
                alt={userProfile.name}
              />
              <AvatarFallback className="text-xl sm:text-2xl">
                {userProfile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl font-bold sm:text-2xl">
                {userProfile.name}
              </h1>
              <p className="text-muted-foreground">@{userProfile.handle}</p>
              {userProfile.description.trim() && (
                <p className="mt-2 text-sm text-gray-700">
                  {userProfile.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 sm:justify-end">
              <FollowButton
                type="user"
                targetHandle={userProfile.handle}
                isFollowing={userProfile.isFollowing}
                isOwnProfile={isOwnProfile}
              />
              <UserProfileOptions
                isOwnProfile={isOwnProfile}
                currentUser={userProfile}
                isAdmin={isAdmin}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center sm:gap-6">
            <div>
              <div className="text-xl font-bold sm:text-2xl">
                {userProfile.reviewsCount}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                reviews
              </div>
            </div>
            <div>
              <div className="text-xl font-bold sm:text-2xl">
                {userProfile.followersCount}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                followers
              </div>
            </div>
            <div>
              <div className="text-xl font-bold sm:text-2xl">
                {userProfile.followingCount}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                following
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold sm:text-xl">Reviews</h2>
      <UserReviewsList userId={userProfile.id} isOwnProfile={isOwnProfile} />
    </div>
  );
};
