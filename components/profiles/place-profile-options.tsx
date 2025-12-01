"use client"

import { ProfileOptionsDropdown } from '@/components/ui/profile-options-dropdown';

type PlaceProfileOptionsProps = {
  isManager: boolean;
  className?: string;
};

export const PlaceProfileOptions = ({
  isManager,
  className,
}: PlaceProfileOptionsProps) => {
  const handleEditPlace = () => {
    // TODO: Implement edit place functionality
    console.log('Edit place clicked');
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
    <ProfileOptionsDropdown
      isOwner={isManager}
      options={getOptions()}
      className={className}
    />
  );
};