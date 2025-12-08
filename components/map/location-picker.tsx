'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Prevent Leaflet from ever importing on the server
const LocationPickerMapInner = dynamic(
  () => import('./location-picker-map').then(mod => ({ default: mod.LocationPickerMapInner })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] w-full rounded-lg overflow-hidden border border-border">
        <Skeleton className="h-full w-full" />
      </div>
    ),
  },
);

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  selectedPosition: Coordinates | null;
  onLocationSelect: (coords: Coordinates) => void;
  initialCenter?: Coordinates;
}

export function LocationPicker({
  selectedPosition,
  onLocationSelect,
  initialCenter,
}: LocationPickerProps) {
  return (
    <LocationPickerMapInner
      selectedPosition={selectedPosition}
      onLocationSelect={onLocationSelect}
      initialCenter={initialCenter}
    />
  );
}

