import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';

interface UserCellProps {
  userHandle: string;
  userName: string;
  userImage: string | null;
}

export function UserCell({ userHandle, userName, userImage }: UserCellProps) {
  return (
    <Link
      href={`/${userHandle}`}
      className="flex items-center gap-3 hover:underline"
    >
      <Avatar className="h-10 w-10">
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200">
            {userName[0].toUpperCase()}
          </div>
        )}
      </Avatar>
      <div>
        <div className="font-medium">{userName}</div>
        <div className="text-sm text-gray-500">@{userHandle}</div>
      </div>
    </Link>
  );
}
