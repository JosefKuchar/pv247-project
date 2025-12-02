import { useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { UserMarkerIcon } from './user-marker-icon';
import { useUserLocation } from '@/hooks/use-user-location';
import { LocateButton } from './locate-button';

export function LocationMarker() {
  const position = useUserLocation();
  const map = useMap();

  useEffect(() => {
    map.locate();
  }, [map]);

  const handleLocate = () => {
    map.locate();
  };
  return (
    <>
      <LocateButton onClick={handleLocate} />
      {position && (
        <Marker position={position} icon={UserMarkerIcon} interactive={false} />
      )}
    </>
  );
}
