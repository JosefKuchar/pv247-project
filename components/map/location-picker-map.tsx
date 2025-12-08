'use client';

import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Custom marker icon for selected location
const SelectedMarkerIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-red-500 drop-shadow-lg" style="color: #ef4444; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
      <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
    </svg>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapClickHandlerProps {
  onLocationSelect: (coords: Coordinates) => void;
}

function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  useMapEvents({
    click: e => {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

interface MapCenterUpdaterProps {
  position: Coordinates | null;
}

function MapCenterUpdater({ position }: MapCenterUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [map, position]);

  return null;
}

interface LocationPickerMapInnerProps {
  selectedPosition: Coordinates | null;
  onLocationSelect: (coords: Coordinates) => void;
  initialCenter?: Coordinates;
}

export function LocationPickerMapInner({
  selectedPosition,
  onLocationSelect,
  initialCenter = { lat: 49.1951, lng: 16.6068 }, // Default to Brno
}: LocationPickerMapInnerProps) {
  return (
    <div className="border-border h-[250px] w-full overflow-hidden rounded-lg border">
      <MapContainer
        center={[initialCenter.lat, initialCenter.lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        <MapCenterUpdater position={selectedPosition} />
        {selectedPosition && (
          <Marker
            position={[selectedPosition.lat, selectedPosition.lng]}
            icon={SelectedMarkerIcon}
          />
        )}
      </MapContainer>
    </div>
  );
}
