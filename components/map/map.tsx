'use client';

import dynamic from 'next/dynamic';
import type { Location } from '@/modules/location/server';

// Prevent Leaflet from ever importing on the server
const MapInner = dynamic(() => import('./map-inner'), {
  ssr: false,
});

interface MapProps {
  locations: Location[];
}

export const Map = ({ locations }: MapProps) => {
  return <MapInner locations={locations} />;
};
