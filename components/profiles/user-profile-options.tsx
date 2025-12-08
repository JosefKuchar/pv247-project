'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { ProfileOptionsDropdown } from '@/components/ui/profile-options-dropdown';
import { EditProfileDialog } from '@/components/profiles/edit-profile-dialog';
import type { userType } from '@/db/schema';

type UserProfileOptionsProps = {
  isOwnProfile: boolean;
  currentUser: userType;
  isAdmin?: boolean;
  className?: string;
};

export const UserProfileOptions = ({
  isOwnProfile,
  currentUser,
  isAdmin = false,
  className,
}: UserProfileOptionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
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
    <>
      <ProfileOptionsDropdown
        isOwner={isOwnProfile}
        options={getOptions()}
        className={className}
      />
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        currentUser={currentUser}
      />
    </>
  );
};
