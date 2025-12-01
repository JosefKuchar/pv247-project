'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocations } from '@/hooks/use-locations';
import { LocationMarker } from './location-marker';
import { PlaceMarkerIcon } from './place-marker-icon';
import { LocationDetail } from './location-detail';

const MapInner = () => {
  const locations = useLocations();

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      <MapContainer
        center={{ lat: 40.7589, lng: -73.9851 }}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
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
