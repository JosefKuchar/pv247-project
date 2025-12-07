'use client';

import { useState } from 'react';
import { ProfileOptionsDropdown } from '@/components/ui/profile-options-dropdown';
import { EditPlaceDialog } from '@/components/profiles/edit-place-dialog';
import type { locationType } from '@/db/schema';

type PlaceProfileOptionsProps = {
  isManager: boolean;
  currentPlace: locationType;
  className?: string;
};

export const PlaceProfileOptions = ({
  isManager,
  currentPlace,
  className,
}: PlaceProfileOptionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditPlace = () => {
    setIsEditDialogOpen(true);
  };

  const handleUnclaimPlace = () => {
    // TODO: Implement unclaim place functionality
    console.log('Unclaim place clicked');
  };

  const handleClaimPlace = () => {
    // TODO: Implement claim place functionality
    console.log('Claim place clicked');
  };

  const getOptions = () => {
    if (isManager) {
      return [
        {
          label: "Edit place's profile",
          onClick: handleEditPlace,
        },
        {
          label: 'Unclaim place',
          onClick: handleUnclaimPlace,
          variant: 'destructive' as const,
        },
      ];
    }

    // For non-managers, show claim option
    return [
      {
        label: 'Claim place',
        onClick: handleClaimPlace,
      },
    ];
  };

  return (
    <>
      <ProfileOptionsDropdown
        isOwner={isManager}
        options={getOptions()}
        className={className}
      />
      <EditPlaceDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        currentPlace={currentPlace}
      />
    </>
  );
};
