import {
  getLocationProfile,
  getLocationFollowStatus,
  getLocationManagementStatus,
} from '@/modules/location/server';
import { notFound } from 'next/navigation';
import { PlaceProfileCard } from '@/components/profiles/placeProfileCard';

export default async function Page({ params }: { params: { handle: string } }) {
  const wrappedParams = await Promise.resolve(params);

  const [placeProfile, followStatus, managementStatus] = await Promise.all([
    getLocationProfile(wrappedParams.handle),
    getLocationFollowStatus(wrappedParams.handle),
    getLocationManagementStatus(wrappedParams.handle),
  ]);

  if (!placeProfile) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <PlaceProfileCard
        placeProfile={{
          ...placeProfile,
          isFollowing: followStatus.isFollowing,
        }}
        isManager={managementStatus.isManager}
      />
    </div>
  );
}
