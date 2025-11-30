import { getUserProfile } from '@/modules/user/server';
import { notFound } from 'next/navigation';
import { UserProfileCard } from '@/components/userProfileCard';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Page({ params }: { params: { handle: string } }) {
  const wrappedParams = await Promise.resolve(params);
  const userProfile = await getUserProfile(wrappedParams.handle);

  if (!userProfile) {
    notFound();
  }

  // Get current session to determine if viewing own profile
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isOwnProfile = session?.user?.handle === userProfile.handle;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <UserProfileCard userProfile={userProfile} isOwnProfile={isOwnProfile} />
    </div>
  );
}
