import Link from 'next/link';

interface LocationCellProps {
  locationHandle: string;
  locationName: string;
  locationAddress: string | null;
}

export function LocationCell({
  locationHandle,
  locationName,
  locationAddress,
}: LocationCellProps) {
  return (
    <Link href={`/place/${locationHandle}`} className="hover:underline">
      <div>
        <div className="font-medium">{locationName}</div>
        {locationAddress && (
          <div className="text-sm text-gray-500">{locationAddress}</div>
        )}
      </div>
    </Link>
  );
}
