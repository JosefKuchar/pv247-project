import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface LocationCardProps {
  location: {
    id: string;
    name: string;
    handle: string;
    address: string | null;
  };
  onClick?: () => void;
}

export function LocationCard({ location, onClick }: LocationCardProps) {
  return (
    <Link
      key={location.id}
      href={`/place/${location.handle}`}
      onClick={onClick}
    >
      <Card className="p-4 transition-shadow hover:shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <MapPin className="h-5 w-5 text-red-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-gray-900">
              {location.name}
            </h3>
            {location.address && (
              <p className="mt-1 truncate text-sm text-gray-500">
                {location.address}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
