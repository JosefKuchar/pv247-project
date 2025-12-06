import { User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import Link from 'next/link';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    handle: string;
    image: string | null;
  };
  onClick?: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <Link key={user.id} href={`/${user.handle}`} onClick={onClick}>
      <Card className="p-4 transition-shadow hover:shadow-lg">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            )}
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-gray-900">
              {user.name}
            </h3>
            <p className="mt-1 truncate text-sm text-gray-500">
              @{user.handle}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
