'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { ProfileOptionsDropdown } from '@/components/ui/profile-options-dropdown';

type UserProfileOptionsProps = {
  isOwnProfile: boolean;
  className?: string;
};

export const UserProfileOptions = ({
  isOwnProfile,
  className,
}: UserProfileOptionsProps) => {
  const router = useRouter();

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked');
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  const getOptions = () => {
    if (isOwnProfile) {
      return [
        {
          label: 'Edit profile',
          onClick: handleEditProfile,
        },
        {
          label: 'Log out',
          onClick: handleLogout,
          variant: 'destructive' as const,
        },
      ];
    }

    // For other users' profiles, no options for now
    return [];
  };

  return (
    <ProfileOptionsDropdown
      isOwner={isOwnProfile}
      options={getOptions()}
      className={className}
    />
  );
};
