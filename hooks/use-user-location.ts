import { LatLng } from 'leaflet';
import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';
export function useUserLocation() {
  const [position, setPosition] = useState<LatLng | null>(null);

  useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      e.target.flyTo(e.latlng, e.target.getZoom());
    },
  });

  return position;
}
