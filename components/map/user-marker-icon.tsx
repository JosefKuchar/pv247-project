import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Circle } from 'lucide-react';

export const UserMarkerIcon = L.divIcon({
  html: renderToStaticMarkup(
    <Circle size={32} color="#ffffffff" fill="#3b82f6" strokeWidth={2} />,
  ),
  className: 'custom-user-marker-icon',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor: [0, -10],
});
