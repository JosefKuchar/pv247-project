import React from 'react';
import { MapPin, X } from 'lucide-react';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
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
    <div className="relative flex w-full max-w-xs flex-col gap-3 rounded-lg p-4">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-1.5 right-1.5 rounded-full p-1 transition hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      )}

      <h2 className="truncate text-lg font-semibold text-gray-900">{name}</h2>

      {address && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{address}</span>
        </div>
      )}
      {typeof averageRating === 'number' && (
        <div className="flex items-center gap-2">
          <Rating value={averageRating || 0} readOnly>
            {Array.from({ length: 5 }).map((_, index) => (
              <RatingButton size={20} className="text-yellow-500" key={index} />
            ))}
          </Rating>
          <span className="text-base font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">/ 5</span>
        </div>
      )}
      <Button
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        onClick={onDetailClick}
      >
        View Details
      </Button>
    </div>
  );
};
