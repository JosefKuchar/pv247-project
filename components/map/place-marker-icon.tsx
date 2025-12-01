import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';

export const PlaceMarkerIcon = L.divIcon({
  html: renderToStaticMarkup(
    <MapPin
      size={32}
      color="#fff"
      fill="#ff2e2e"
      strokeWidth={2}
      className="rounded-full drop-shadow-md"
    />,
  ),
  className:
    'custom-marker-icon flex items-center justify-center rounded-full drop-shadow-md',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor: [0, -10],
});
