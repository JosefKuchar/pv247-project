'use client';

import dynamic from 'next/dynamic';

// Prevent Leaflet from ever importing on the server
export const Map = dynamic(() => import('./map-inner'), {
  ssr: false,
});
