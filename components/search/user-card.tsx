import { User as UserIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import type { User } from './search-results';

interface UserCardProps {
  user: User;
  onClick?: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <Link key={user.id} href={`/${user.handle}`} onClick={onClick}>
      <Card className="p-4 transition-shadow hover:shadow-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback>
              <UserIcon className="h-5 w-5 text-blue-600" />
            </AvatarFallback>
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
