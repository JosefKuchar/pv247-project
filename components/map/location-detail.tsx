import React from 'react';
import { MapPin, X } from 'lucide-react';
import { Stars } from '@/components/ui/stars';
import { Button } from '@/components/ui/button';

interface LocationDetailProps {
  name: string;
  address?: string | null;
  averageRating?: number | null;
  onDetailClick?: () => void;
  onClose?: () => void;
}

export const LocationDetail: React.FC<LocationDetailProps> = ({
  name,
  address,
  averageRating,
  onDetailClick,
  onClose,
}) => {
  return (
    <div className="relative w-full max-w-sm rounded-xl bg-white p-3 shadow-xl">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-1.5 right-1.5 rounded-full p-1 transition hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      )}

      <h2 className="mb-2 pr-5 text-base font-bold text-gray-900 md:text-xl">
        {name}
      </h2>

      {address && (
        <div className="mb-2 flex items-start gap-1 text-xs text-gray-600 md:text-sm">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
          <span>{address}</span>
        </div>
      )}

      <div className="mb-3 flex items-center gap-1.5">
        <Stars rating={averageRating || 0} />
        <span className="text-base font-bold text-gray-900 md:text-lg">
          {typeof averageRating === 'number' ? averageRating.toFixed(1) : 'N/A'}
        </span>
        <span className="text-xs text-gray-500">/ 5</span>
      </div>

      <Button
        className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 md:text-base"
        onClick={onDetailClick}
      >
        View Details
      </Button>
    </div>
  );
};
