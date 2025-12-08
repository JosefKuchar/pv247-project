import { Map } from '@/components/map/map';
import { getAllLocations } from '@/modules/location/server';

const Page = async () => {
  const locations = await getAllLocations();

  return <Map locations={locations} />;
};

export default Page;
