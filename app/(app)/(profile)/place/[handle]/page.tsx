import { getLocationProfile } from '@/modules/location/server';
import { notFound } from 'next/navigation';
import { PlaceProfileCard } from '@/components/placeProfileCard';

export default async function Page({ params }: { params: { handle: string } }) {
  const wrappedParams = await Promise.resolve(params);
  const placeProfile = await getLocationProfile(wrappedParams.handle);

  if (!placeProfile) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <PlaceProfileCard placeProfile={placeProfile} />
    </div>
  );
}
