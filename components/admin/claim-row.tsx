'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { approveClaim, rejectClaim } from '@/app/admin/claims/actions';
import Link from 'next/link';

type ClaimData = {
  id: string;
  userId: string;
  locationId: string;
  approved: boolean;
  createdAt: Date;
  userName: string;
  userHandle: string;
  userImage: string | null;
  locationName: string;
  locationHandle: string;
  locationAddress: string | null;
};

interface ClaimRowProps {
  claim: ClaimData;
  onRemove: (claimId: string) => void;
}

export function ClaimRow({ claim, onRemove }: ClaimRowProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await approveClaim(claim.id);
      onRemove(claim.id);
    } catch (error) {
      console.error('Failed to approve claim:', error);
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await rejectClaim(claim.id);
      onRemove(claim.id);
    } catch (error) {
      console.error('Failed to reject claim:', error);
      setIsLoading(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <Link
          href={`/${claim.userHandle}`}
          className="flex items-center gap-3 hover:underline"
        >
          <Avatar className="h-10 w-10">
            {claim.userImage ? (
              <img
                src={claim.userImage}
                alt={claim.userName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200">
                {claim.userName[0].toUpperCase()}
              </div>
            )}
          </Avatar>
          <div>
            <div className="font-medium">{claim.userName}</div>
            <div className="text-sm text-gray-500">@{claim.userHandle}</div>
          </div>
        </Link>
      </td>
      <td className="px-6 py-4">
        <Link
          href={`/place/${claim.locationHandle}`}
          className="hover:underline"
        >
          <div>
            <div className="font-medium">{claim.locationName}</div>
            {claim.locationAddress && (
              <div className="text-sm text-gray-500">
                {claim.locationAddress}
              </div>
            )}
          </div>
        </Link>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">
          {new Date(claim.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button
            onClick={handleReject}
            disabled={isLoading}
            size="sm"
            variant="destructive"
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
        </div>
      </td>
    </tr>
  );
}
