import { getUserProfile } from '@/modules/user/server';
import { notFound } from 'next/navigation';
import { UserProfileCard } from '@/components/userProfileCard';
export default async function Page({ params }: { params: { handle: string } }) {
  const wrappedParams = await Promise.resolve(params);
  const userProfile = await getUserProfile(wrappedParams.handle);

  if (!userProfile) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <UserProfileCard userProfile={userProfile} />
    </div>
  );
}
