import { Map } from '@/components/map/map';
import { getAllLocations } from '@/modules/location/server';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const locations = await getAllLocations();

  return <Map locations={locations} />;
};

export default Page;
