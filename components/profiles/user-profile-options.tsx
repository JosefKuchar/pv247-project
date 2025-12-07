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
  className?: string;
};

export const UserProfileOptions = ({
  isOwnProfile,
  currentUser,
  className,
}: UserProfileOptionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
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
