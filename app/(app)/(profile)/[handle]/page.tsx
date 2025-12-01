import { getUserProfile, getUserFollowStatus } from '@/modules/user/server';
import { UserProfileCard } from '@/components/profiles/userProfileCard';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Page({ params }: { params: { handle: string } }) {
  const wrappedParams = await Promise.resolve(params);

  // Get current session to determine if viewing own profile
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [userProfile, followStatus] = await Promise.all([
    getUserProfile(wrappedParams.handle),
    getUserFollowStatus(wrappedParams.handle),
  ]);

  if (!userProfile) {
    throw new Error('User not found');
  }

  const isOwnProfile = session?.user?.handle === userProfile.handle;

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <UserProfileCard
        userProfile={{ ...userProfile, isFollowing: followStatus.isFollowing }}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
}
