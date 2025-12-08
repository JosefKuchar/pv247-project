'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { ProfileOptionsDropdown } from '@/components/ui/profile-options-dropdown';

type UserProfileOptionsProps = {
  isOwnProfile: boolean;
  isAdmin?: boolean;
  className?: string;
};

export const UserProfileOptions = ({
  isOwnProfile,
  isAdmin = false,
  className,
}: UserProfileOptionsProps) => {
  const router = useRouter();

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked');
  };

  const handleAdminPanel = () => {
    router.push('/admin/claims');
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
    const options = [];

    if (isOwnProfile) {
      options.push({
        label: 'Edit profile',
        onClick: handleEditProfile,
      });

      if (isAdmin) {
        options.push({
          label: 'Admin panel',
          onClick: handleAdminPanel,
        });
      }

      options.push({
        label: 'Log out',
        onClick: handleLogout,
        variant: 'destructive' as const,
      });
    }

    return options;
  };

  return (
    <ProfileOptionsDropdown
      isOwner={isOwnProfile}
      options={getOptions()}
      className={className}
    />
  );
};
