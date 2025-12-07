import { createColumnHelper } from '@tanstack/react-table';
import { UserCell } from './user-cell';
import { LocationCell } from './location-cell';
import { DateCell } from './date-cell';
import { ActionsCell } from './actions-cell';

export type ClaimData = {
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

const columnHelper = createColumnHelper<ClaimData>();

export const getClaimsColumns = (
  loadingClaims: Set<string>,
  onApprove: (claimId: string) => void,
  onReject: (claimId: string) => void,
) => [
  columnHelper.accessor('userName', {
    id: 'user',
    header: 'User',
    cell: info => {
      const claim = info.row.original;
      return (
        <UserCell
          userHandle={claim.userHandle}
          userName={claim.userName}
          userImage={claim.userImage}
        />
      );
    },
  }),
  columnHelper.accessor('locationName', {
    id: 'location',
    header: 'Location',
    cell: info => {
      const claim = info.row.original;
      return (
        <LocationCell
          locationHandle={claim.locationHandle}
          locationName={claim.locationName}
          locationAddress={claim.locationAddress}
        />
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    header: 'Requested',
    cell: info => <DateCell date={info.getValue()} />,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: info => {
      const claim = info.row.original;
      const isLoading = loadingClaims.has(claim.id);
      return (
        <ActionsCell
          claimId={claim.id}
          isLoading={isLoading}
          onApprove={onApprove}
          onReject={onReject}
        />
      );
    },
  }),
];
