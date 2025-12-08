'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Prevent Leaflet from ever importing on the server
const LocationPickerMapInner = dynamic(
  () =>
    import('./location-picker-map').then(mod => ({
      default: mod.LocationPickerMapInner,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="border-border h-[250px] w-full overflow-hidden rounded-lg border">
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
