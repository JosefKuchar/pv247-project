import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import type { userType } from '@/db/schema';

type UserProfile = userType & {
  followersCount: number,
  followingCount: number,
  reviewsCount: number
}

type UserProfileCardProps = {
  userProfile: UserProfile
}


export const UserProfileCard = ({ userProfile }: UserProfileCardProps) => {
  return <Card>
    <CardContent className="p-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={userProfile.image || undefined} alt={userProfile.name} />
          <AvatarFallback className="text-2xl">
            {userProfile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{userProfile.name}</h1>
          <p className="text-muted-foreground">@{userProfile.handle}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-2xl font-bold">{userProfile.reviewsCount}</div>
          <div className="text-muted-foreground">posts</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{userProfile.followersCount}</div>
          <div className="text-muted-foreground">followers</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{userProfile.followingCount}</div>
          <div className="text-muted-foreground">following</div>
        </div>
      </div>

      {/* TODO: Posts display will be implemented later */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
        Posts display - TODO
      </div>
    </CardContent>
  </Card>
}
