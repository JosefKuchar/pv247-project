'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Location } from '@/modules/location/server';
import { LocationMarker } from './location-marker';
import { PlaceMarkerIcon } from './place-marker-icon';
import { LocationDetail } from './location-detail';

interface MapInnerProps {
  locations: Location[];
}

const MapInner = ({ locations }: MapInnerProps) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-full overflow-hidden">
      <MapContainer
        center={{ lat: 49.1951, lng: 16.6068 }}
        zoom={17}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map(loc => (
          <Marker
            key={loc.id}
            position={{ lat: loc.latitude, lng: loc.longitude }}
            icon={PlaceMarkerIcon}
          >
            <Popup>
              <LocationDetail
                name={loc.name}
                address={loc.address}
                averageRating={loc.averageRating}
                onDetailClick={() =>
                  (window.location.href = `/place/${loc.handle}`)
                }
              />
            </Popup>
          </Marker>
        ))}

        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapInner;
