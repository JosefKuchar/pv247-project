'use client';

import { useState } from 'react';
import { ProfileOptionsDropdown } from '@/components/ui/profile-options-dropdown';
import { EditPlaceDialog } from '@/components/profiles/edit-place-dialog';
import type { locationType } from '@/db/schema';
import { claimPlaceAction, unclaimPlaceAction } from '@/app/actions/locations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type PlaceProfileOptionsProps = {
  isManager: boolean;
  currentPlace: locationType;
  hasPendingClaim?: boolean;
  className?: string;
};

export const PlaceProfileOptions = ({
  isManager,
  currentPlace,
  hasPendingClaim = false,
  className,
}: PlaceProfileOptionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleEditPlace = () => {
    setIsEditDialogOpen(true);
  };

  const claimMutation = useMutation({
    mutationFn: () => claimPlaceAction(currentPlace.handle),
    onSuccess: result => {
      if (result.success) {
        toast.success(result.message || 'Claim submitted successfully');
        // Invalidate queries and refresh the page to update the UI
        queryClient.invalidateQueries();
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to submit claim');
      }
    },
    onError: () => {
      toast.error('An error occurred. Please try again.');
    },
  });

  const unclaimMutation = useMutation({
    mutationFn: () => unclaimPlaceAction(currentPlace.handle),
    onSuccess: result => {
      if (result.success) {
        toast.success(result.message || 'Location unclaimed successfully');
        // Invalidate queries and refresh the page to update the UI
        queryClient.invalidateQueries();
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to unclaim location');
      }
    },
    onError: () => {
      toast.error('An error occurred. Please try again.');
    },
  });

  const handleUnclaimPlace = () => {
    unclaimMutation.mutate();
  };

  const handleClaimPlace = () => {
    claimMutation.mutate();
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

    if (hasPendingClaim) {
      return [
        {
          label: 'Claim request already sent',
          onClick: () => {},
          variant: 'default' as const,
          disabled: true,
        },
      ];
    }

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
