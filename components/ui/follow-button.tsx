'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, MapPin, Loader2 } from 'lucide-react';
import {
  followUserAction,
  unfollowUserAction,
  followLocationAction,
  unfollowLocationAction,
} from '@/app/actions/follow';
import { cn } from '@/lib/utils';

type FollowButtonProps = {
  type: 'user' | 'location';
  targetHandle: string;
  isFollowing: boolean;
  isOwnProfile?: boolean;
  className?: string;
};

export function FollowButton({
  type,
  targetHandle,
  isFollowing: initialIsFollowing,
  isOwnProfile = false,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  // Don't render if it's the user's own profile
  if (isOwnProfile) {
    return null;
  }

  const handleFollow = () => {
    startTransition(async () => {
      try {
        if (isFollowing) {
          if (type === 'user') {
            await unfollowUserAction({ targetUserHandle: targetHandle });
          } else {
            await unfollowLocationAction({ locationHandle: targetHandle });
          }
          setIsFollowing(false);
        } else {
          if (type === 'user') {
            await followUserAction({ targetUserHandle: targetHandle });
          } else {
            await followLocationAction({ locationHandle: targetHandle });
          }
          setIsFollowing(true);
        }
      } catch (error) {
        console.error('Follow action failed:', error);
        // Could add toast notification here
      }
    });
  };

  const getIcon = () => {
    if (isPending) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    if (isFollowing) {
      return type === 'user' ? (
        <UserMinus className="h-4 w-4" />
      ) : (
        <MapPin className="h-4 w-4" />
      );
    }

    return type === 'user' ? (
      <UserPlus className="h-4 w-4" />
    ) : (
      <MapPin className="h-4 w-4" />
    );
  };

  const getButtonText = () => {
    if (isPending) {
      return isFollowing ? 'Unfollowing...' : 'Following...';
    }

    if (isFollowing) {
      return type === 'user' ? 'Unfollow' : 'Unfollow';
    }

    return type === 'user' ? 'Follow' : 'Follow';
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={isPending}
      variant={isFollowing ? 'outline' : 'default'}
      className={cn(
        'gap-2 transition-all',
        isFollowing &&
          'hover:bg-destructive hover:border-destructive hover:text-white',
        className,
      )}
    >
      {getIcon()}
      {getButtonText()}
    </Button>
  );
}
