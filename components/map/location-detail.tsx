import React from 'react';

interface LocationDetailProps {
  name: string;
  address?: string | null;
  averageRating?: number | null;
  onDetailClick?: () => void;
}

export const LocationDetail: React.FC<LocationDetailProps> = ({
  name,
  address,
  averageRating,
  onDetailClick,
}) => (
  <div className="min-w-[180px] space-y-2">
    <div>
      <strong className="text-lg">{name}</strong>
    </div>
    {address && <div className="text-sm text-gray-600">{address}</div>}
    <div className="flex items-center gap-2">
      <span className="text-yellow-500">★</span>
      <span className="font-medium">
        {typeof averageRating === 'number' ? averageRating.toFixed(1) : 'N/A'}
      </span>
      <span className="text-xs text-gray-500">/ 5</span>
    </div>
    <button
      className="mt-2 w-full rounded bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700"
      onClick={onDetailClick}
    >
      Detail
    </button>
  </div>
);
