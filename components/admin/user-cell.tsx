import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
        <AvatarImage src={userImage || undefined} alt={userName} />
        <AvatarFallback>{userName[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{userName}</div>
        <div className="text-sm text-gray-500">@{userHandle}</div>
      </div>
    </Link>
  );
}
