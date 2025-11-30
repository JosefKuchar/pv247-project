import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';

export const PlaceMarkerIcon = L.divIcon({
  html: renderToStaticMarkup(
    <MapPin size={32} color="#ffffffff" fill="#ff2e2eff" strokeWidth={2} />,
  ),
  className: 'custom-marker-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
